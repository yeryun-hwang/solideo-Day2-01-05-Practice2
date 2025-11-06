# 🚀 GitHub Pages 배포 가이드

## ⚠️ 중요: 백엔드 배포 필요

GitHub Pages는 **정적 파일만 호스팅**합니다. 백엔드 API는 별도로 배포해야 합니다.

---

## 📦 1단계: GitHub Pages 배포

### 현재 상태
✅ `index.html`과 정적 파일들이 루트에 배치됨
✅ `.nojekyll` 파일 생성됨

### GitHub에서 설정

1. GitHub 저장소 페이지로 이동
2. **Settings** → **Pages** 클릭
3. **Source**: `Deploy from a branch` 선택
4. **Branch**: `main` (또는 현재 브랜치) 선택, 폴더는 `/ (root)` 선택
5. **Save** 클릭

### 배포 URL
약 1-2분 후 다음 주소에서 접속 가능:
```
https://yeryun-hwang.github.io/solideo-Day2-01-05-Practice2/
```

---

## 🖥️ 2단계: 백엔드 배포 (필수!)

프론트엔드만으로는 작동하지 않습니다. 백엔드 API를 배포해야 합니다.

### 옵션 A: Render.com (무료, 권장)

#### 1. Render 계정 생성
https://render.com/ 가입 (GitHub 연동)

#### 2. 새 Web Service 생성
- **Name**: `travel-planner-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Free tier 선택**

#### 3. 환경 변수 설정
Render 대시보드에서:
```
PORT=5000
NODE_ENV=production
```

#### 4. 배포 완료
URL 예시: `https://travel-planner-backend.onrender.com`

### 옵션 B: Railway.app (무료)

#### 1. Railway 계정 생성
https://railway.app/ 가입

#### 2. New Project → Deploy from GitHub
- 저장소 선택
- Root Directory: `backend`
- Start Command: `npm start`

#### 3. 환경 변수 설정
```
PORT=5000
NODE_ENV=production
```

### 옵션 C: Vercel (서버리스)

Vercel은 서버리스 함수로 변환 필요 (복잡함)

---

## 🔗 3단계: 프론트엔드-백엔드 연결

백엔드 배포 후, 프론트엔드에서 API URL을 업데이트해야 합니다.

### 방법 1: 환경 변수 사용 (권장)

`frontend/.env.production` 파일 생성:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

`frontend/src/App.js` 수정:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const response = await fetch(`${API_URL}/api/travel/itinerary`, {
  // ...
});
```

### 방법 2: 직접 수정

`frontend/src/App.js`에서 `/api/travel/itinerary`를
`https://your-backend-url.onrender.com/api/travel/itinerary`로 변경

### 재빌드 및 재배포
```bash
cd frontend
npm run build
cp -r build/* ../
git add .
git commit -m "Update API URL for production"
git push
```

---

## 🛠️ 4단계: CORS 설정

백엔드에서 GitHub Pages 도메인 허용:

`backend/server.js` 수정:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yeryun-hwang.github.io'
  ]
}));
```

---

## ✅ 배포 체크리스트

- [ ] GitHub Pages 활성화
- [ ] 백엔드를 Render/Railway에 배포
- [ ] 백엔드 URL 획득
- [ ] 프론트엔드에 백엔드 URL 설정
- [ ] CORS 설정
- [ ] 프론트엔드 재빌드
- [ ] Git push
- [ ] 배포된 사이트에서 테스트

---

## 🌐 최종 결과

### 프론트엔드 (GitHub Pages)
```
https://yeryun-hwang.github.io/solideo-Day2-01-05-Practice2/
```

### 백엔드 (Render/Railway)
```
https://your-backend-name.onrender.com
```

---

## 💡 팁

### Render 무료 플랜 주의사항
- 15분 비활성 시 슬립 모드
- 첫 요청 시 30초 정도 대기 (콜드 스타트)
- 월 750시간 무료 제공

### Railway 무료 플랜
- 월 $5 크레딧 제공
- 더 빠른 콜드 스타트

### 대안: 풀 스택 배포
Vercel이나 Netlify에서 풀 스택 배포도 가능하지만 설정이 복잡합니다.

---

## 🆘 문제 해결

### "Failed to fetch" 오류
- 백엔드가 실행 중인지 확인
- CORS 설정 확인
- 브라우저 콘솔에서 API URL 확인

### 백엔드 슬립 모드
- Render의 경우 첫 요청 시 30초 대기
- 또는 유료 플랜 사용

### API 키 관련
- OpenStreetMap은 API 키 불필요
- 별도 설정 없이 작동

---

**배포에 도움이 필요하시면 알려주세요!** 🚀
