import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapDisplay.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons for different activity types
const createCustomIcon = (color, number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 16px;
      border: 3px solid white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [35, 35],
    iconAnchor: [17, 17],
  });
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

// Component to handle map bounds
function MapBounds({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
}

function MapDisplayLeaflet({ itinerary }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [mapCenter, setMapCenter] = useState([37.5665, 126.9780]); // Default: Seoul
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (itinerary && selectedDay === 0 && itinerary.mainTransportation) {
      // Show main route
      const route = itinerary.mainTransportation;
      if (route.legs && route.legs[0]) {
        const start = route.legs[0].start_location;
        const end = route.legs[0].end_location;

        setBounds([
          [start.lat, start.lng],
          [end.lat, end.lng]
        ]);
        setMapCenter([(start.lat + end.lat) / 2, (start.lng + end.lng) / 2]);
      }
    } else if (itinerary && selectedDay > 0) {
      // Show day activities
      const day = itinerary.days.find(d => d.day === selectedDay);
      if (day && day.activities && day.activities.length > 0) {
        const activityBounds = day.activities
          .filter(a => a.location && a.location.lat && a.location.lng)
          .map(a => [a.location.lat, a.location.lng]);

        if (activityBounds.length > 0) {
          setBounds(activityBounds);

          // Calculate center
          const avgLat = activityBounds.reduce((sum, coord) => sum + coord[0], 0) / activityBounds.length;
          const avgLng = activityBounds.reduce((sum, coord) => sum + coord[1], 0) / activityBounds.length;
          setMapCenter([avgLat, avgLng]);
        }
      }
    }
  }, [itinerary, selectedDay]);

  const renderMainRoute = () => {
    if (!itinerary.mainTransportation || selectedDay !== 0) return null;

    const route = itinerary.mainTransportation;
    if (!route.legs || !route.legs[0]) return null;

    const start = route.legs[0].start_location;
    const end = route.legs[0].end_location;

    return (
      <>
        <Marker position={[start.lat, start.lng]}>
          <Popup>
            <div>
              <h4>출발지</h4>
              <p>{itinerary.origin}</p>
            </div>
          </Popup>
        </Marker>
        <Marker position={[end.lat, end.lng]}>
          <Popup>
            <div>
              <h4>도착지</h4>
              <p>{itinerary.destination}</p>
            </div>
          </Popup>
        </Marker>
        <Polyline
          positions={[[start.lat, start.lng], [end.lat, end.lng]]}
          color="#667eea"
          weight={4}
          opacity={0.7}
        />
      </>
    );
  };

  const renderDayActivities = () => {
    if (selectedDay === 0) return null;

    const day = itinerary.days.find(d => d.day === selectedDay);
    if (!day || !day.activities) return null;

    const validActivities = day.activities.filter(
      a => a.location && a.location.lat && a.location.lng
    );

    return (
      <>
        {validActivities.map((activity, index) => (
          <Marker
            key={index}
            position={[activity.location.lat, activity.location.lng]}
            icon={createCustomIcon(getMarkerColor(activity.type), index + 1)}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{activity.name}</h4>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
                  {activity.time} - {activity.description}
                </p>
                <p style={{ margin: '4px 0', fontSize: '12px' }}>
                  📍 {activity.address}
                </p>
                {activity.rating && (
                  <p style={{ margin: '4px 0', fontSize: '12px' }}>
                    ⭐ {activity.rating}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Draw lines between activities */}
        {validActivities.length > 1 && (
          <Polyline
            positions={validActivities.map(a => [a.location.lat, a.location.lng])}
            color="#667eea"
            weight={3}
            opacity={0.6}
            dashArray="5, 10"
          />
        )}
      </>
    );
  };

  if (!itinerary) {
    return <div className="map-loading">지도를 불러오는 중...</div>;
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
        {itinerary.days && itinerary.days.map(day => (
          <button
            key={day.day}
            className={`control-button ${selectedDay === day.day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day.day)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '500px', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bounds && <MapBounds bounds={bounds} />}
        {renderMainRoute()}
        {renderDayActivities()}
      </MapContainer>

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

      <div className="map-info">
        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem', textAlign: 'center' }}>
          🌍 Powered by OpenStreetMap - 전 세계 무료 지도 서비스
        </p>
      </div>
    </div>
  );
}

export default MapDisplayLeaflet;
