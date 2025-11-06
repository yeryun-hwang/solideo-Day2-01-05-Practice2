# 🌍 여행 개인화 앱 (Personalized Travel Planner)

**전 세계 어디든 무료로!** OpenStreetMap 기반 맞춤형 여행 일정 생성 웹 애플리케이션

## ✨ 특징

- ✅ **API 키 불필요** - 완전 무료, 설정 필요 없음
- ✅ **전 세계 지원** - 한국, 일본, 유럽, 미국 등 모든 국가
- ✅ **오픈소스** - OpenStreetMap 기반
- ✅ **실시간 경로** - OSRM으로 최적 경로 계산
- ✅ **비용 비교** - 최저 비용 vs 최단 시간 경로 선택

## 📋 주요 기능

### 1. 여행 정보 입력
- **출발지 - 도착지 설정**: 전 세계 어디든 건물명 또는 주소로 입력 가능
- **출발 시간 설정**: 여행 시작 시간 지정
- **여행 기간 설정**: 1일부터 7일까지 선택 가능

### 2. 경로 비교 및 선택 🆕
- 💰 **최저 비용 경로**: 가장 저렴한 교통비로 이동
- ⚡ **최단 시간 경로**: 가장 빠르게 도착
- ⭐ **최고 가성비 경로**: 시간과 비용의 균형
- **상세 비교표**: 교통비, 소요시간, 환승 횟수 한눈에 비교
- **절약 금액 표시**: 경로 선택에 따른 비용 절감액 표시

### 3. 실시간 경로 탐색
- 🚗 최적 경로 계산 (OSRM 사용)
- 📍 정확한 위치 검색 (Nominatim 사용)
- **소요 시간 및 거리**: 정확한 이동 시간과 거리 정보 제공
- **다중 경로 옵션**: 여러 경로를 비교하여 최적 선택

### 4. 맞춤형 여행지 추천
- **취향 설문**: 관광지 유형, 음식 종류, 가격대 등 개인 취향 입력
- **관광지 추천**: Overpass API를 활용한 관광지 추천
- **맛집 추천**: 사용자 취향에 맞는 레스토랑 및 카페 추천
- **평점 기반 필터링**: 최소 평점 설정으로 품질 보장

### 5. 상세 일정 자동 생성
- **일별 일정**: 아침부터 저녁까지 시간대별 상세 일정
- **다양한 활동**: 관광, 식사, 쇼핑, 나이트라이프 등 균형잡힌 일정
- **장소 정보**: 각 장소의 이름, 주소, 위치 정보 제공

### 6. 대화형 지도 시각화
- **Leaflet.js 지도**: 전 세계를 커버하는 오픈소스 지도
- **OpenStreetMap 데이터**: 전 세계 무료 지도 데이터
- **경로 표시**: 출발지에서 도착지까지의 전체 이동 경로
- **일별 활동 표시**: 각 날짜별 방문 장소를 지도에 마커로 표시
- **정보 팝업**: 마커 클릭 시 장소 상세 정보 확인

## 🛠️ 기술 스택

### 백엔드
- **Node.js**: JavaScript 런타임
- **Express.js**: 웹 서버 프레임워크
- **Axios**: HTTP 클라이언트
- **OpenStreetMap APIs** (모두 무료!):
  - **Nominatim API**: 주소 검색 및 지오코딩
  - **OSRM API**: 경로 탐색 및 최적화
  - **Overpass API**: 관광지 및 장소 검색

### 프론트엔드
- **React**: UI 라이브러리
- **Leaflet.js**: 오픈소스 지도 라이브러리
- **react-leaflet**: React용 Leaflet 컴포넌트
- **CSS3**: 모던 스타일링
- **Responsive Design**: 모바일 친화적 디자인

## 📦 설치 및 실행

### 사전 요구사항
- Node.js (v14 이상)
- **API 키 불필요!** 🎉

### 1. 프로젝트 설정

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

### 2. 애플리케이션 실행

#### 개발 모드로 실행

터미널 1 - 백엔드 서버:
```bash
cd backend
npm start
```

터미널 2 - 프론트엔드 서버:
```bash
cd frontend
npm start
```

브라우저에서 http://localhost:3000 접속

**또는 실행 스크립트 사용:**

```bash
# 터미널 1
./start-backend.sh

# 터미널 2
./start-frontend.sh
```

## 🎯 사용 방법

### 1단계: 여행 정보 입력
1. 출발지와 도착지를 입력합니다 (예: "Seoul, South Korea", "Tokyo, Japan")
2. 출발 시간을 선택합니다
3. 여행 기간을 선택합니다 (1-7일)
4. "다음 단계로" 버튼 클릭

### 2단계: 취향 설정
1. 선호하는 관광지 유형을 입력합니다 (예: "museum, park, beach")
2. 선호하는 음식 종류를 입력합니다 (예: "Korean, Japanese, Italian")
3. 최소 평점을 선택합니다 (3.0 ~ 4.5)
4. 가격대를 선택합니다 ($ ~ $$$$)
5. 추가 옵션을 선택합니다:
   - 쇼핑 포함
   - 나이트라이프/바 포함
   - 관광지 제외 (맛집 중심)
6. "여행 일정 생성하기" 버튼 클릭

### 3단계: 경로 선택 🆕
1. 3가지 경로 옵션 확인:
   - 💰 **최저 비용**: 12,000원, 2시간 30분
   - ⚡ **최단 시간**: 17,000원, 1시간 45분
   - ⭐ **최고 가성비**: 14,500원, 2시간 10분
2. 원하는 경로 카드 클릭
3. 절약 금액 및 비교표 확인
4. "선택한 경로로 여행 계획 보기" 버튼 클릭

### 4단계: 일정 확인
1. **좌측 패널**: 상세 여행 일정
   - 출발/귀가 교통편 정보
   - 일별 활동 일정
   - 각 장소의 상세 정보
2. **우측 패널**: 지도 시각화
   - "전체 경로" 버튼: 출발지에서 도착지까지의 이동 경로
   - "Day 1", "Day 2" 등: 각 날짜별 방문 장소
   - 마커 클릭: 장소 상세 정보 팝업
3. **경로 변경**: 언제든지 다른 경로로 변경 가능

## 📁 프로젝트 구조

```
solideo-Day2-01-05-Practice2/
├── backend/
│   ├── controllers/
│   │   └── travelController.js      # 요청 처리 로직
│   ├── routes/
│   │   └── travel.js                # API 라우트 정의
│   ├── services/
│   │   ├── openStreetMapService.js  # OpenStreetMap API 통합
│   │   ├── costCalculator.js        # 경로 비용 계산
│   │   └── itineraryService.js      # 일정 생성 로직
│   ├── package.json
│   └── server.js                    # Express 서버
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TravelForm.js        # 여행 정보 입력 폼
│   │   │   ├── PreferencesForm.js   # 취향 설문 폼
│   │   │   ├── RouteComparison.js   # 경로 비교 컴포넌트 🆕
│   │   │   ├── ItineraryDisplay.js  # 일정 표시 컴포넌트
│   │   │   └── MapDisplayLeaflet.js # Leaflet 지도 컴포넌트
│   │   ├── App.js                   # 메인 애플리케이션
│   │   └── index.js
│   └── package.json
├── .env.example                     # 환경 변수 예시 (API 키 불필요!)
├── .gitignore
├── LICENSE.md
└── README.md
```

## 🔌 API 엔드포인트

### POST /api/travel/itinerary
완전한 여행 일정 생성 (경로 비교 포함)

**요청 본문:**
```json
{
  "origin": "Seoul, South Korea",
  "destination": "Busan, South Korea",
  "departureTime": "2025-11-06T09:00:00",
  "duration": "3",
  "preferences": {
    "attractionKeywords": "museum, beach",
    "cuisine": "seafood, Korean",
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
    "routeOptions": {
      "cheapest": { /* 최저 비용 일정 */ },
      "fastest": { /* 최단 시간 일정 */ },
      "bestValue": { /* 최고 가성비 일정 */ }
    },
    "comparison": {
      "savings": {
        "amount": 5000,
        "percentage": "29.4",
        "formatted": "5,000원"
      },
      "timeDifference": 45
    }
  }
}
```

## 🌟 주요 특징

### 완전 무료
- API 키 발급 불필요
- 사용량 제한 없음 (공용 서비스 정책 준수)
- 설정 없이 바로 실행

### 전 세계 지원
- OpenStreetMap의 글로벌 데이터
- 한국, 일본, 중국, 유럽, 미국 등 모든 국가
- 다양한 언어로 주소 검색 가능

### 지능형 경로 비교
- 비용과 시간을 동시에 고려
- 실시간 절약 금액 표시
- 환승 횟수 최소화

### 직관적인 UI/UX
- 단계별 가이드로 쉬운 정보 입력
- 실시간 로딩 인디케이터
- 반응형 디자인으로 모바일 지원
- 아름다운 그라디언트 디자인

## 🚀 향후 개선 계획

- [ ] 대중교통 실시간 정보 통합
- [ ] 사용자 계정 및 로그인 기능
- [ ] 일정 저장 및 공유 기능
- [ ] 여행 예산 계산 기능
- [ ] 날씨 정보 통합
- [ ] 숙박 시설 추천
- [ ] 다국어 지원
- [ ] 오프라인 모드
- [ ] AI 기반 추천 시스템 개선

## 🗺️ OpenStreetMap에 대하여

이 프로젝트는 [OpenStreetMap](https://www.openstreetmap.org/)의 오픈 데이터를 사용합니다.

**사용된 서비스:**
- **Nominatim**: 주소 검색 및 지오코딩 (무료)
- **OSRM**: Open Source Routing Machine - 경로 탐색 (무료)
- **Overpass API**: POI (관심 지점) 검색 (무료)
- **Leaflet.js**: 오픈소스 JavaScript 지도 라이브러리

**공용 서비스 사용 시 주의사항:**
- Nominatim: 초당 1회 요청 제한 (공용 서버)
- 대량 사용 시 자체 서버 구축 권장
- [Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) 준수

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE.md](LICENSE.md) 파일을 참조하세요.

## 🤝 기여

프로젝트에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 감사의 말

- OpenStreetMap contributors
- Nominatim, OSRM, Overpass API teams
- Leaflet.js team
- React 커뮤니티
- Express.js 팀
- 모든 오픈소스 기여자들

## 🌐 예시 여행지

이 앱으로 계획할 수 있는 여행:

### 아시아
- 서울 → 부산 (한국)
- 도쿄 → 오사카 (일본)
- 베이징 → 상하이 (중국)
- 방콕 → 치앙마이 (태국)

### 유럽
- 파리 → 런던
- 로마 → 베니스
- 바르셀로나 → 마드리드
- 베를린 → 뮌헨

### 북미
- 뉴욕 → 보스턴
- 샌프란시스코 → 로스앤젤레스
- 시카고 → 디트로이트

---

**즐거운 여행 되세요! 🌏✈️**

*Powered by OpenStreetMap - 전 세계 무료 지도 서비스*
