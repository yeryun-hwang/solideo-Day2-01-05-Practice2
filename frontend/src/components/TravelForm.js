import React, { useState } from 'react';
import './TravelForm.css';

function TravelForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureTime: '',
    duration: '3',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.origin || !formData.destination || !formData.departureTime) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="travel-form-container">
      <h2>여행 정보를 입력하세요</h2>
      <form onSubmit={handleSubmit} className="travel-form">
        <div className="form-group">
          <label htmlFor="origin">
            출발지 (건물명 또는 주소) *
          </label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="예: 서울역, 강남구 테헤란로 123"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="destination">
            도착지 (건물명 또는 주소) *
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="예: 부산역, 해운대구 해운대해변로"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="departureTime">
            출발 시간 *
          </label>
          <input
            type="datetime-local"
            id="departureTime"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">
            여행 기간 (일) *
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          >
            <option value="1">1일</option>
            <option value="2">2일</option>
            <option value="3">3일</option>
            <option value="4">4일</option>
            <option value="5">5일</option>
            <option value="6">6일</option>
            <option value="7">7일</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          다음 단계로
        </button>
      </form>
    </div>
  );
}

export default TravelForm;
