# 🚀 백엔드 배포 가이드 (Render.com)

## ⚡ 빠른 배포 (5분 완료)

### 1단계: Render.com 가입

1. https://render.com 접속
2. **Get Started for Free** 클릭
3. **GitHub로 가입** 선택 (가장 쉬움)
4. GitHub 계정으로 로그인

---

### 2단계: 새 Web Service 생성

1. Render 대시보드에서 **New +** 버튼 클릭
2. **Web Service** 선택
3. **Connect a repository** → GitHub 연결
4. 저장소 검색: `solideo-Day2-01-05-Practice2` 선택
5. **Connect** 클릭

---

### 3단계: 서비스 설정

다음 내용을 입력하세요:

#### 기본 설정
- **Name**: `travel-planner-backend` (원하는 이름)
- **Region**: `Oregon (US West)` (무료)
- **Branch**: `claude/travel-personalization-app-011CUrMj5xJ3xoEUzE84kZAa` 또는 `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`

#### 빌드 & 시작 명령
- **Build Command**:
  ```bash
  npm install
  ```

- **Start Command**:
  ```bash
  npm start
  ```

#### 플랜
- **Instance Type**: `Free` 선택 ✅

---

### 4단계: 환경 변수 설정 (선택)

Environment 섹션에서:

```
PORT = 5000
NODE_ENV = production
```

**주의**: OpenStreetMap을 사용하므로 API 키는 필요 없습니다!

---

### 5단계: 배포!

1. **Create Web Service** 버튼 클릭
2. 배포가 시작됩니다 (약 2-3분 소요)
3. 로그를 보면서 배포 진행상황 확인

#### 배포 성공 확인

로그에서 다음 메시지를 확인:
```
==> Server is running on port 5000
==> Your service is live 🎉
```

---

### 6단계: 백엔드 URL 복사

배포 완료 후 상단에 표시되는 URL을 복사하세요:

```
https://travel-planner-backend.onrender.com
```

또는 아래와 같은 형식:

```
https://travel-planner-backend-xxxx.onrender.com
```

---

## 🔗 프론트엔드 연결

백엔드 URL을 확인했으면, 프론트엔드에서 이 URL을 사용하도록 설정해야 합니다.

### 방법 1: 환경 변수 사용 (권장)

`frontend/.env.production` 파일 생성:

```env
REACT_APP_API_URL=https://travel-planner-backend.onrender.com
```

### 방법 2: 코드에 직접 입력

`frontend/src/App.js` 파일 수정:

```javascript
// 22번째 줄 근처에서 수정
const handlePreferencesSubmit = async (prefs) => {
  setPreferences(prefs);
  setLoading(true);

  try {
    // 이 부분을 수정
    const API_URL = 'https://your-backend-url.onrender.com'; // 여기에 복사한 URL 붙여넣기

    const response = await fetch(`${API_URL}/api/travel/itinerary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // ... 나머지 코드
    });
```

---

## 🔄 프론트엔드 재배포

백엔드 URL을 설정한 후:

```bash
# 1. 프론트엔드 재빌드
cd frontend
npm run build

# 2. 빌드 파일을 루트로 복사
cd ..
rm -rf static index.html asset-manifest.json
cp -r frontend/build/* .

# 3. Git에 커밋 & 푸시
git add .
git commit -m "Connect frontend to deployed backend"
git push
```

GitHub Pages가 자동으로 업데이트됩니다 (1-2분 소요)

---

## ✅ 테스트

### 1. 백엔드 테스트

브라우저에서 다음 URL 접속:

```
https://your-backend-url.onrender.com/health
```

다음과 같은 응답이 나오면 성공:

```json
{
  "status": "OK",
  "message": "Travel Planner API is running"
}
```

### 2. 전체 앱 테스트

1. GitHub Pages 접속: `https://yeryun-hwang.github.io/solideo-Day2-01-05-Practice2/`
2. 여행 정보 입력
3. 취향 설정
4. "여행 일정 생성하기" 버튼 클릭
5. 경로 선택 화면이 나오면 성공! 🎉

---

## ⚠️ 주의사항

### Render 무료 플랜 제한

- **슬립 모드**: 15분 동안 요청이 없으면 자동으로 슬립
- **콜드 스타트**: 슬립 후 첫 요청은 30초 정도 걸림
- **월 750시간 무료**: 충분히 사용 가능

### 슬립 모드 해결 방법

1. **유료 플랜 사용** ($7/월)
2. **Cron-job.org**로 5분마다 핑 보내기
3. **첫 사용자에게 대기 안내** (30초 기다려주세요)

---

## 🛠️ 문제 해결

### "Build failed" 오류

**원인**: npm install 실패

**해결**:
- Root Directory가 `backend`로 설정되었는지 확인
- Build Command가 `npm install`인지 확인

### "Service Unavailable" 오류

**원인**: 서버가 아직 시작 중

**해결**: 1-2분 기다린 후 재시도

### CORS 오류

**원인**: 백엔드에서 프론트엔드 도메인 차단

**해결**: `backend/server.js`에 이미 설정되어 있음 (확인 완료)

---

## 🎯 완료 체크리스트

- [ ] Render.com 가입
- [ ] Web Service 생성
- [ ] 빌드 설정 입력
- [ ] 배포 완료 확인
- [ ] 백엔드 URL 복사
- [ ] /health 엔드포인트 테스트
- [ ] 프론트엔드에 백엔드 URL 설정
- [ ] 프론트엔드 재빌드
- [ ] GitHub Pages 재배포
- [ ] 전체 앱 테스트

---

## 💡 대안: Railway.app

Railway도 무료로 배포 가능:

1. https://railway.app 가입
2. **New Project** → **Deploy from GitHub**
3. 저장소 선택
4. **Root Directory**: `backend` 설정
5. **Start Command**: `npm start`
6. 배포 완료

Railway는 콜드 스타트가 더 빠릅니다!

---

**배포 완료 후 앱이 완벽하게 작동합니다!** 🚀

도움이 필요하시면 언제든 문의하세요!
