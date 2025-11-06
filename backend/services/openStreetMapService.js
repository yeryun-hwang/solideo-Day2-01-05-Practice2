const axios = require('axios');

// OpenStreetMap 기반 API 서비스 (무료, API 키 불필요)
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OSRM_BASE_URL = 'https://router.project-osrm.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

// Geocoding: 주소를 좌표로 변환
exports.geocode = async (address) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'TravelPlannerApp/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        address: result.address
      };
    }

    throw new Error('Location not found');
  } catch (error) {
    console.error('Error in geocoding:', error);
    throw error;
  }
};

// Reverse Geocoding: 좌표를 주소로 변환
exports.reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json'
      },
      headers: {
        'User-Agent': 'TravelPlannerApp/1.0'
      }
    });

    if (response.data) {
      return {
        displayName: response.data.display_name,
        address: response.data.address
      };
    }

    throw new Error('Address not found');
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    throw error;
  }
};

// 경로 탐색 (OSRM 사용)
exports.getDirections = async (origin, destination, alternatives = true) => {
  try {
    // 주소를 좌표로 변환
    const originCoords = await this.geocode(origin);
    const destCoords = await this.geocode(destination);

    // OSRM으로 경로 요청
    const response = await axios.get(
      `${OSRM_BASE_URL}/route/v1/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}`,
      {
        params: {
          alternatives: alternatives ? 'true' : 'false',
          steps: true,
          annotations: true,
          overview: 'full',
          geometries: 'geojson'
        }
      }
    );

    if (response.data.code !== 'Ok') {
      throw new Error(`OSRM API error: ${response.data.code}`);
    }

    // Google Maps 형식과 유사하게 변환
    const routes = response.data.routes.map(route => ({
      legs: [{
        distance: {
          value: route.distance,
          text: `${(route.distance / 1000).toFixed(1)} km`
        },
        duration: {
          value: route.duration,
          text: this.formatDuration(route.duration)
        },
        start_location: {
          lat: originCoords.lat,
          lng: originCoords.lng
        },
        end_location: {
          lat: destCoords.lat,
          lng: destCoords.lng
        },
        start_address: originCoords.displayName,
        end_address: destCoords.displayName,
        steps: route.legs[0].steps.map(step => ({
          distance: {
            value: step.distance,
            text: `${(step.distance / 1000).toFixed(1)} km`
          },
          duration: {
            value: step.duration,
            text: this.formatDuration(step.duration)
          },
          start_location: {
            lat: step.maneuver.location[1],
            lng: step.maneuver.location[0]
          },
          end_location: {
            lat: step.maneuver.location[1],
            lng: step.maneuver.location[0]
          },
          travel_mode: 'DRIVING',
          instructions: step.maneuver.type
        }))
      }],
      overview_polyline: route.geometry,
      summary: `Route via ${origin} to ${destination}`
    }));

    return routes;
  } catch (error) {
    console.error('Error getting directions:', error);
    throw error;
  }
};

// 장소 검색 (Overpass API 사용)
exports.searchPlaces = async (lat, lng, radius = 5000, type = 'tourism', keyword = '') => {
  try {
    // Overpass QL 쿼리 생성
    let amenityType = 'tourism';
    if (type === 'restaurant') amenityType = 'amenity';
    if (type === 'shopping_mall') amenityType = 'shop';

    const query = `
      [out:json];
      (
        node["${amenityType}"](around:${radius},${lat},${lng});
        way["${amenityType}"](around:${radius},${lat},${lng});
      );
      out center 20;
    `;

    const response = await axios.post(
      OVERPASS_BASE_URL,
      query,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (!response.data || !response.data.elements) {
      return [];
    }

    // Google Places 형식과 유사하게 변환
    const places = response.data.elements
      .filter(element => element.tags && element.tags.name)
      .map(element => {
        const placeLat = element.lat || (element.center ? element.center.lat : null);
        const placeLng = element.lon || (element.center ? element.center.lon : null);

        return {
          name: element.tags.name,
          vicinity: element.tags['addr:street'] || element.tags['addr:city'] || 'Address not available',
          geometry: {
            location: {
              lat: placeLat,
              lng: placeLng
            }
          },
          rating: 4.0, // OSM doesn't have ratings, use default
          place_id: element.id,
          types: [type]
        };
      })
      .filter(place => place.geometry.location.lat && place.geometry.location.lng);

    return places;
  } catch (error) {
    console.error('Error searching places:', error);
    // Return empty array if search fails
    return [];
  }
};

// 특정 타입의 장소 검색
exports.getPlaces = async (location, radius = 5000, type = 'tourist_attraction', keyword = '', preferences = {}) => {
  try {
    // location이 "lat,lng" 형식이면 파싱, 아니면 geocoding
    let lat, lng;
    if (typeof location === 'string' && location.includes(',')) {
      [lat, lng] = location.split(',').map(parseFloat);
    } else {
      const coords = await this.geocode(location);
      lat = coords.lat;
      lng = coords.lng;
    }

    const places = await this.searchPlaces(lat, lng, radius, type, keyword);

    // 필터링 적용
    if (preferences && preferences.minRating) {
      // OSM doesn't have ratings, so we'll keep all places
    }

    return places;
  } catch (error) {
    console.error('Error in getPlaces:', error);
    return [];
  }
};

// 시간 포맷팅 헬퍼
exports.formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
};

// 필터링 함수
exports.filterPlacesByPreferences = (places, preferences) => {
  let filtered = places;

  if (preferences.minRating) {
    filtered = filtered.filter(place => (place.rating || 0) >= preferences.minRating);
  }

  // OSM doesn't have price levels, so skip that filter

  return filtered;
};
