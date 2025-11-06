import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import './MapDisplay.css';

const libraries = ['places', 'directions'];

function MapDisplay({ itinerary }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedDay, setSelectedDay] = useState(1);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Initialize map
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: { lat: 37.5665, lng: 126.9780 }, // Default to Seoul
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      const renderer = new window.google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: false,
      });

      setMap(newMap);
      setDirectionsRenderer(renderer);
    }
  }, [isLoaded, map]);

  // Display main route
  useEffect(() => {
    if (map && directionsRenderer && itinerary && selectedDay === 0) {
      displayMainRoute();
    }
  }, [map, directionsRenderer, itinerary, selectedDay]);

  // Display daily activities
  useEffect(() => {
    if (map && itinerary && selectedDay > 0) {
      displayDayActivities(selectedDay);
    }
  }, [map, itinerary, selectedDay]);

  const displayMainRoute = () => {
    if (!directionsRenderer || !itinerary.mainTransportation) return;

    // Clear existing markers
    clearMarkers();

    // Display the route using DirectionsRenderer
    const route = itinerary.mainTransportation;
    directionsRenderer.setDirections({
      routes: [route],
      request: {
        origin: itinerary.origin,
        destination: itinerary.destination,
        travelMode: window.google.maps.TravelMode.TRANSIT,
      },
    });

    // Fit bounds to show entire route
    const bounds = new window.google.maps.LatLngBounds();
    route.legs[0].steps.forEach(step => {
      bounds.extend(step.start_location);
      bounds.extend(step.end_location);
    });
    map.fitBounds(bounds);
  };

  const displayDayActivities = (dayNumber) => {
    // Clear existing route
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }

    // Clear existing markers
    clearMarkers();

    const day = itinerary.days.find(d => d.day === dayNumber);
    if (!day) return;

    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers = [];

    // Create markers for each activity
    day.activities.forEach((activity, index) => {
      const position = {
        lat: activity.location.lat,
        lng: activity.location.lng,
      };

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: activity.name,
        label: {
          text: `${index + 1}`,
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: getMarkerColor(activity.type),
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h4 style="margin: 0 0 5px 0;">${activity.name}</h4>
            <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">
              ${activity.time} - ${activity.description}
            </p>
            <p style="margin: 0; font-size: 12px;">
              ${activity.address}
            </p>
            ${activity.rating ? `<p style="margin: 5px 0 0 0; font-size: 12px;">⭐ ${activity.rating}</p>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);

    // Draw lines between activities
    if (day.activities.length > 1) {
      const path = day.activities.map(a => ({
        lat: a.location.lat,
        lng: a.location.lng,
      }));

      new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#667eea',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });
    }

    // Fit bounds to show all markers
    map.fitBounds(bounds);
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'attraction':
        return '#667eea';
      case 'restaurant':
        return '#f59e0b';
      case 'shopping':
        return '#ec4899';
      case 'nightlife':
        return '#8b5cf6';
      default:
        return '#667eea';
    }
  };

  const clearMarkers = () => {
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);
  };

  if (loadError) {
    return (
      <div className="map-error">
        <p>지도를 로드하는 중 오류가 발생했습니다.</p>
        <p className="error-detail">Google Maps API 키를 확인해주세요.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>지도를 로드하는 중...</p>
      </div>
    );
  }

  return (
    <div className="map-display">
      <h3>🗺️ 여행 경로</h3>

      <div className="map-controls">
        <button
          className={`control-button ${selectedDay === 0 ? 'active' : ''}`}
          onClick={() => setSelectedDay(0)}
        >
          전체 경로
        </button>
        {itinerary.days.map(day => (
          <button
            key={day.day}
            className={`control-button ${selectedDay === day.day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day.day)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <div ref={mapRef} className="map-container" />

      <div className="map-legend">
        <h4>범례</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#667eea' }}></span>
            <span>관광지</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
            <span>음식점</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ec4899' }}></span>
            <span>쇼핑</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>
            <span>나이트라이프</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapDisplay;
