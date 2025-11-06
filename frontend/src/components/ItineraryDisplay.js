import React from 'react';
import './ItineraryDisplay.css';

function ItineraryDisplay({ itinerary }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTransitStep = (step) => {
    if (step.travel_mode === 'TRANSIT') {
      const transit = step.transit_details;
      return {
        mode: transit.line.vehicle.type,
        name: transit.line.name || transit.line.short_name,
        from: transit.departure_stop.name,
        to: transit.arrival_stop.name,
        departure: transit.departure_time.text,
        arrival: transit.arrival_time.text,
        duration: step.duration.text
      };
    }
    return null;
  };

  return (
    <div className="itinerary-display">
      <h3>여행 일정표</h3>

      {/* Main Transportation */}
      <div className="section">
        <h4>🚆 출발 교통편</h4>
        <div className="transport-card">
          <div className="route-summary">
            <span className="location">{itinerary.origin}</span>
            <span className="arrow">→</span>
            <span className="location">{itinerary.destination}</span>
          </div>
          <div className="route-details">
            <div className="detail-item">
              <span className="label">총 소요시간:</span>
              <span className="value">{itinerary.mainTransportation.legs[0].duration.text}</span>
            </div>
            <div className="detail-item">
              <span className="label">총 거리:</span>
              <span className="value">{itinerary.mainTransportation.legs[0].distance.text}</span>
            </div>
            <div className="detail-item">
              <span className="label">출발시간:</span>
              <span className="value">{new Date(itinerary.departureTime).toLocaleString('ko-KR')}</span>
            </div>
          </div>

          {/* Transit Steps */}
          <div className="transit-steps">
            {itinerary.mainTransportation.legs[0].steps
              .filter(step => step.travel_mode === 'TRANSIT')
              .map((step, idx) => {
                const transit = formatTransitStep(step);
                if (!transit) return null;

                return (
                  <div key={idx} className="transit-step">
                    <div className="transit-icon">
                      {transit.mode === 'BUS' && '🚌'}
                      {transit.mode === 'SUBWAY' && '🚇'}
                      {transit.mode === 'TRAIN' && '🚆'}
                      {transit.mode === 'TRAM' && '🚊'}
                    </div>
                    <div className="transit-info">
                      <div className="transit-line">{transit.name}</div>
                      <div className="transit-route">
                        {transit.from} → {transit.to}
                      </div>
                      <div className="transit-time">
                        {transit.departure} - {transit.arrival} ({transit.duration})
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="section">
        <h4>📅 일별 일정</h4>
        {itinerary.days.map((day, dayIdx) => (
          <div key={dayIdx} className="day-card">
            <div className="day-header">
              <h5>Day {day.day}</h5>
              <span className="date">{formatDate(day.date)}</span>
            </div>
            <div className="activities">
              {day.activities.map((activity, actIdx) => (
                <div key={actIdx} className="activity-item">
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-type">
                        {activity.type === 'attraction' && '🏛️ 관광'}
                        {activity.type === 'restaurant' && '🍽️ 식사'}
                        {activity.type === 'shopping' && '🛍️ 쇼핑'}
                        {activity.type === 'nightlife' && '🌙 나이트'}
                      </span>
                      <span className="activity-name">{activity.name}</span>
                    </div>
                    <div className="activity-details">
                      <div className="activity-address">📍 {activity.address}</div>
                      {activity.rating && (
                        <div className="activity-rating">⭐ {activity.rating}</div>
                      )}
                      {activity.priceLevel && (
                        <div className="activity-price">
                          {'$'.repeat(activity.priceLevel)}
                        </div>
                      )}
                    </div>
                    {activity.description && (
                      <div className="activity-description">{activity.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Return Transportation */}
      {itinerary.returnTransportation && (
        <div className="section">
          <h4>🏠 귀가 교통편</h4>
          <div className="transport-card">
            <div className="route-summary">
              <span className="location">{itinerary.destination}</span>
              <span className="arrow">→</span>
              <span className="location">{itinerary.origin}</span>
            </div>
            <div className="route-details">
              <div className="detail-item">
                <span className="label">총 소요시간:</span>
                <span className="value">{itinerary.returnTransportation.legs[0].duration.text}</span>
              </div>
              <div className="detail-item">
                <span className="label">총 거리:</span>
                <span className="value">{itinerary.returnTransportation.legs[0].distance.text}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItineraryDisplay;
