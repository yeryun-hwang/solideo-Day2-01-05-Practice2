import React, { useState } from 'react';
import './App.css';
import TravelForm from './components/TravelForm';
import PreferencesForm from './components/PreferencesForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import MapDisplay from './components/MapDisplay';

function App() {
  const [step, setStep] = useState(1);
  const [travelData, setTravelData] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTravelSubmit = (data) => {
    setTravelData(data);
    setStep(2);
  };

  const handlePreferencesSubmit = async (prefs) => {
    setPreferences(prefs);
    setLoading(true);

    try {
      const response = await fetch('/api/travel/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: travelData.origin,
          destination: travelData.destination,
          departureTime: travelData.departureTime,
          duration: travelData.duration,
          preferences: prefs,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setItinerary(result.data);
        setStep(3);
      } else {
        alert('여행 일정 생성에 실패했습니다: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('여행 일정 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setTravelData(null);
    setPreferences(null);
    setItinerary(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌍 여행 개인화 앱</h1>
        <p>당신만의 맞춤형 여행 일정을 만들어보세요</p>
      </header>

      <main className="App-main">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>여행 일정을 생성하고 있습니다...</p>
          </div>
        )}

        {step === 1 && (
          <TravelForm onSubmit={handleTravelSubmit} />
        )}

        {step === 2 && (
          <PreferencesForm
            onSubmit={handlePreferencesSubmit}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && itinerary && (
          <div className="results-container">
            <div className="results-header">
              <h2>여행 일정이 완성되었습니다!</h2>
              <button onClick={handleReset} className="reset-button">
                새로운 여행 계획하기
              </button>
            </div>
            <div className="results-grid">
              <div className="itinerary-section">
                <ItineraryDisplay itinerary={itinerary} />
              </div>
              <div className="map-section">
                <MapDisplay itinerary={itinerary} />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>© 2025 여행 개인화 앱 - 실시간 대중교통 정보 제공</p>
      </footer>
    </div>
  );
}

export default App;
