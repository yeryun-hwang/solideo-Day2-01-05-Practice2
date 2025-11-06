import React, { useState } from 'react';
import './PreferencesForm.css';

function PreferencesForm({ onSubmit, onBack }) {
  const [preferences, setPreferences] = useState({
    attractionKeywords: '',
    cuisine: '',
    minRating: '4.0',
    priceLevel: '2',
    includeShopping: false,
    includeNightlife: false,
    skipAttractions: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <div className="preferences-form-container">
      <h2>여행 취향을 알려주세요</h2>
      <p className="subtitle">더 맞춤화된 여행 일정을 위해 취향을 설정해주세요</p>

      <form onSubmit={handleSubmit} className="preferences-form">
        <div className="form-group">
          <label htmlFor="attractionKeywords">
            선호하는 관광지 유형
          </label>
          <input
            type="text"
            id="attractionKeywords"
            name="attractionKeywords"
            value={preferences.attractionKeywords}
            onChange={handleChange}
            placeholder="예: 박물관, 역사, 자연, 해변, 공원"
          />
          <small>쉼표로 구분하여 여러 키워드 입력 가능</small>
        </div>

        <div className="form-group">
          <label htmlFor="cuisine">
            선호하는 음식 종류
          </label>
          <input
            type="text"
            id="cuisine"
            name="cuisine"
            value={preferences.cuisine}
            onChange={handleChange}
            placeholder="예: 한식, 일식, 중식, 이탈리안, 카페"
          />
          <small>쉼표로 구분하여 여러 음식 종류 입력 가능</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="minRating">
              최소 평점
            </label>
            <select
              id="minRating"
              name="minRating"
              value={preferences.minRating}
              onChange={handleChange}
            >
              <option value="3.0">3.0 이상</option>
              <option value="3.5">3.5 이상</option>
              <option value="4.0">4.0 이상</option>
              <option value="4.5">4.5 이상</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priceLevel">
              가격대
            </label>
            <select
              id="priceLevel"
              name="priceLevel"
              value={preferences.priceLevel}
              onChange={handleChange}
            >
              <option value="1">저렴함 ($)</option>
              <option value="2">보통 ($$)</option>
              <option value="3">비쌈 ($$$)</option>
              <option value="4">매우 비쌈 ($$$$)</option>
            </select>
          </div>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="includeShopping"
              checked={preferences.includeShopping}
              onChange={handleChange}
            />
            <span>쇼핑 포함</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="includeNightlife"
              checked={preferences.includeNightlife}
              onChange={handleChange}
            />
            <span>나이트라이프/바 포함</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="skipAttractions"
              checked={preferences.skipAttractions}
              onChange={handleChange}
            />
            <span>관광지 제외 (맛집 중심)</span>
          </label>
        </div>

        <div className="button-group">
          <button type="button" onClick={onBack} className="back-button">
            이전
          </button>
          <button type="submit" className="submit-button">
            여행 일정 생성하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default PreferencesForm;
