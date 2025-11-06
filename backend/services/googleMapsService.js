const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api';

// Get directions with real-time transit information
exports.getDirections = async (origin, destination, departureTime, travelMode = 'transit') => {
  try {
    const params = {
      origin,
      destination,
      mode: travelMode,
      key: GOOGLE_MAPS_API_KEY,
      alternatives: true,
      departure_time: departureTime ? new Date(departureTime).getTime() / 1000 : 'now'
    };

    // Add transit mode specific parameters
    if (travelMode === 'transit') {
      params.transit_mode = 'bus|subway|train|tram|rail';
      params.transit_routing_preference = 'fewer_transfers';
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/directions/json`, { params });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }

    return response.data.routes;
  } catch (error) {
    console.error('Error in getDirections:', error);
    throw error;
  }
};

// Get nearby places based on preferences
exports.getPlaces = async (location, radius = 5000, type = 'tourist_attraction', keyword = '', preferences = {}) => {
  try {
    const params = {
      location,
      radius,
      key: GOOGLE_MAPS_API_KEY
    };

    if (type) {
      params.type = type;
    }

    if (keyword) {
      params.keyword = keyword;
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/place/nearbysearch/json`, { params });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    // Filter and rank places based on preferences
    let places = response.data.results || [];

    if (preferences) {
      places = this.filterPlacesByPreferences(places, preferences);
    }

    return places;
  } catch (error) {
    console.error('Error in getPlaces:', error);
    throw error;
  }
};

// Get place details
exports.getPlaceDetails = async (placeId) => {
  try {
    const params = {
      place_id: placeId,
      key: GOOGLE_MAPS_API_KEY,
      fields: 'name,rating,formatted_address,photos,opening_hours,website,formatted_phone_number,reviews'
    };

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/place/details/json`, { params });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Place Details API error: ${response.data.status}`);
    }

    return response.data.result;
  } catch (error) {
    console.error('Error in getPlaceDetails:', error);
    throw error;
  }
};

// Filter places based on user preferences
exports.filterPlacesByPreferences = (places, preferences) => {
  let filtered = places;

  // Filter by rating if specified
  if (preferences.minRating) {
    filtered = filtered.filter(place => place.rating >= preferences.minRating);
  }

  // Filter by price level if specified
  if (preferences.priceLevel) {
    filtered = filtered.filter(place => {
      if (!place.price_level) return true;
      return place.price_level <= preferences.priceLevel;
    });
  }

  // Sort by rating (descending)
  filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return filtered;
};

// Search places by text query
exports.searchPlaces = async (query, location) => {
  try {
    const params = {
      query,
      key: GOOGLE_MAPS_API_KEY
    };

    if (location) {
      params.location = location;
      params.radius = 50000; // 50km radius
    }

    const response = await axios.get(`${GOOGLE_MAPS_BASE_URL}/place/textsearch/json`, { params });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places Text Search API error: ${response.data.status}`);
    }

    return response.data.results || [];
  } catch (error) {
    console.error('Error in searchPlaces:', error);
    throw error;
  }
};
