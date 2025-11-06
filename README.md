# 🌍 여행 개인화 앱 (Personalized Travel Planner)

실시간 대중교통 정보를 활용한 맞춤형 여행 일정 생성 웹 애플리케이션

## 📋 주요 기능

### 1. 여행 정보 입력
- **출발지 - 도착지 설정**: 건물명 또는 주소로 입력 가능
- **출발 시간 설정**: 실시간 대중교통 정보를 위한 정확한 출발 시간 입력
- **여행 기간 설정**: 1일부터 7일까지 선택 가능

### 2. 실시간 대중교통 연계
- 🚌 버스, 🚇 지하철, 🚆 기차, 🚊 트램 등 다양한 대중교통 수단 지원
- **실시간 교통 정보**: Google Maps API를 활용한 실시간 운행 정보
- **최적 경로 안내**: 환승 횟수를 최소화한 경로 추천
- **소요 시간 및 거리**: 정확한 이동 시간과 거리 정보 제공

### 3. 맞춤형 여행지 추천
- **취향 설문**: 관광지 유형, 음식 종류, 가격대 등 개인 취향 입력
- **관광지 추천**: Google Places API를 활용한 인기 관광지 추천
- **맛집 추천**: 사용자 취향에 맞는 레스토랑 및 카페 추천
- **평점 기반 필터링**: 최소 평점 설정으로 품질 보장

### 4. 상세 일정 자동 생성
- **일별 일정**: 아침부터 저녁까지 시간대별 상세 일정
- **다양한 활동**: 관광, 식사, 쇼핑, 나이트라이프 등 균형잡힌 일정
- **장소 정보**: 각 장소의 이름, 주소, 평점, 가격대 정보 제공

### 5. 지도 시각화
- **Google Maps 통합**: 인터랙티브 지도로 전체 경로 확인
- **경로 표시**: 출발지에서 도착지까지의 전체 이동 경로
- **일별 활동 표시**: 각 날짜별 방문 장소를 지도에 마커로 표시
- **정보 팝업**: 마커 클릭 시 장소 상세 정보 확인

## 🛠️ 기술 스택

### 백엔드
- **Node.js**: JavaScript 런타임
- **Express.js**: 웹 서버 프레임워크
- **Axios**: HTTP 클라이언트
- **Google Maps APIs**:
  - Directions API (경로 탐색)
  - Places API (장소 검색)
  - Geocoding API (주소 변환)

### 프론트엔드
- **React**: UI 라이브러리
- **@react-google-maps/api**: Google Maps React 통합
- **CSS3**: 모던 스타일링
- **Responsive Design**: 모바일 친화적 디자인

## 📦 설치 및 실행

### 사전 요구사항
- Node.js (v14 이상)
- Google Maps API Key

### 1. Google Maps API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"에서 다음 API 활성화:
   - Maps JavaScript API
   - Directions API
   - Places API
   - Geocoding API
4. "API 및 서비스" > "사용자 인증 정보"에서 API 키 생성

### 2. 프로젝트 설정

```bash
# 저장소 클론
git clone <repository-url>
cd solideo-Day2-01-05-Practice2

# 백엔드 의존성 설치
cd backend
npm install

# 프론트엔드 의존성 설치
cd ../frontend
npm install
```

### 3. 환경 변수 설정

#### 백엔드 (.env 파일 생성)
```bash
cd backend
cp ../.env.example .env
```

`.env` 파일 편집:
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
PORT=5000
NODE_ENV=development
```

#### 프론트엔드 (.env 파일 생성)
```bash
cd frontend
```

`.env` 파일 생성:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 4. 애플리케이션 실행

#### 개발 모드로 실행

터미널 1 - 백엔드 서버:
```bash
cd backend
npm start
# 또는 개발 모드 (자동 재시작)
npm run dev
```

터미널 2 - 프론트엔드 서버:
```bash
cd frontend
npm start
```

브라우저에서 http://localhost:3000 접속

## 🎯 사용 방법

### 1단계: 여행 정보 입력
1. 출발지와 도착지를 입력합니다 (예: "서울역", "부산역")
2. 출발 시간을 선택합니다
3. 여행 기간을 선택합니다 (1-7일)
4. "다음 단계로" 버튼 클릭

### 2단계: 취향 설정
1. 선호하는 관광지 유형을 입력합니다 (예: "박물관, 역사, 해변")
2. 선호하는 음식 종류를 입력합니다 (예: "한식, 해산물")
3. 최소 평점을 선택합니다 (3.0 ~ 4.5)
4. 가격대를 선택합니다 ($ ~ $$$$)
5. 추가 옵션을 선택합니다:
   - 쇼핑 포함
   - 나이트라이프/바 포함
   - 관광지 제외 (맛집 중심)
6. "여행 일정 생성하기" 버튼 클릭

### 3단계: 일정 확인
1. **좌측 패널**: 상세 여행 일정
   - 출발/귀가 교통편 정보
   - 일별 활동 일정
   - 각 장소의 상세 정보
2. **우측 패널**: 지도 시각화
   - "전체 경로" 버튼: 출발지에서 도착지까지의 이동 경로
   - "Day 1", "Day 2" 등: 각 날짜별 방문 장소
   - 마커 클릭: 장소 상세 정보 팝업

## 📁 프로젝트 구조

```
solideo-Day2-01-05-Practice2/
├── backend/
│   ├── controllers/
│   │   └── travelController.js      # 요청 처리 로직
│   ├── routes/
│   │   └── travel.js                # API 라우트 정의
│   ├── services/
│   │   ├── googleMapsService.js     # Google Maps API 통합
│   │   └── itineraryService.js      # 일정 생성 로직
│   ├── package.json
│   └── server.js                    # Express 서버
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TravelForm.js        # 여행 정보 입력 폼
│   │   │   ├── TravelForm.css
│   │   │   ├── PreferencesForm.js   # 취향 설문 폼
│   │   │   ├── PreferencesForm.css
│   │   │   ├── ItineraryDisplay.js  # 일정 표시 컴포넌트
│   │   │   ├── ItineraryDisplay.css
│   │   │   ├── MapDisplay.js        # 지도 표시 컴포넌트
│   │   │   └── MapDisplay.css
│   │   ├── App.js                   # 메인 애플리케이션
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── .env.example                     # 환경 변수 예시
├── .gitignore
├── LICENSE.md
└── README.md
```

## 🔌 API 엔드포인트

### POST /api/travel/directions
실시간 경로 정보 조회

**요청 본문:**
```json
{
  "origin": "서울역",
  "destination": "부산역",
  "departureTime": "2025-11-06T09:00:00",
  "travelMode": "transit"
}
```

**응답:**
```json
{
  "success": true,
  "data": [/* Google Directions API 결과 */]
}
```

### POST /api/travel/places
장소 검색

**요청 본문:**
```json
{
  "location": "37.5665,126.9780",
  "radius": 5000,
  "type": "tourist_attraction",
  "keyword": "박물관",
  "preferences": {
    "minRating": 4.0,
    "priceLevel": 2
  }
}
```

**응답:**
```json
{
  "success": true,
  "data": [/* Google Places API 결과 */]
}
```

### POST /api/travel/itinerary
완전한 여행 일정 생성

**요청 본문:**
```json
{
  "origin": "서울역",
  "destination": "부산역",
  "departureTime": "2025-11-06T09:00:00",
  "duration": "3",
  "preferences": {
    "attractionKeywords": "박물관, 해변",
    "cuisine": "해산물, 한식",
    "minRating": 4.0,
    "priceLevel": 2,
    "includeShopping": true,
    "includeNightlife": false
  }
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "origin": "서울역",
    "destination": "부산역",
    "departureTime": "2025-11-06T09:00:00",
    "duration": "3",
    "mainTransportation": {/* 출발 교통편 정보 */},
    "days": [
      {
        "day": 1,
        "date": "2025-11-06",
        "activities": [/* 일별 활동 목록 */]
      }
    ],
    "returnTransportation": {/* 귀가 교통편 정보 */}
  }
}
```

## 🌟 주요 특징

### 실시간 대중교통 정보
- Google Directions API의 `departure_time` 파라미터를 사용하여 실시간 교통 정보 제공
- 버스, 지하철, 기차 등의 실시간 운행 시간표 반영
- 교통 상황을 고려한 정확한 소요 시간 계산

### 지능형 일정 생성
- 사용자 취향을 분석하여 맞춤형 장소 추천
- 시간대별로 적절한 활동 배치 (아침: 관광, 점심: 식사 등)
- 평점과 가격대를 고려한 장소 필터링

### 직관적인 UI/UX
- 단계별 가이드로 쉬운 정보 입력
- 실시간 로딩 인디케이터
- 반응형 디자인으로 모바일 지원
- 아름다운 그라디언트 디자인

### 상세한 시각화
- 대화형 지도로 경로 확인
- 일별 활동을 지도에 표시
- 색상으로 구분된 활동 유형
- 클릭 가능한 마커로 상세 정보 제공

## 🚀 향후 개선 계획

- [ ] 사용자 계정 및 로그인 기능
- [ ] 일정 저장 및 공유 기능
- [ ] 여행 예산 계산 기능
- [ ] 날씨 정보 통합
- [ ] 숙박 시설 추천
- [ ] 다국어 지원
- [ ] 오프라인 모드
- [ ] AI 기반 추천 시스템 개선
- [ ] 소셜 미디어 통합

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE.md](LICENSE.md) 파일을 참조하세요.

## 🤝 기여

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 문의

프로젝트 관련 문의사항이나 버그 리포트는 이슈 트래커를 이용해주세요.

## 🙏 감사의 말

- Google Maps Platform for APIs
- React 커뮤니티
- Express.js 팀
- 모든 오픈소스 기여자들

---

**즐거운 여행 되세요! 🌏✈️**
