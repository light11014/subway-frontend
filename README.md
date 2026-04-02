# 서울 지하철 2호선 실시간 운행 시각화

서울 지하철 2호선의 운행 현황을 원형 노선도로 시각화한 React 기반 프로젝트입니다.  
열차 위치, 진행 방향(외선 / 내선), 선택 열차 상세 정보, 열차 목록을 한 화면에서 확인할 수 있습니다.

## 주요 기능

- 2호선 순환선 노선도 시각화
- 외선 / 내선 열차 위치 표시
- 열차 선택 시 상세 정보 패널 표시
- 열차 목록 확인
- 데모 모드 / 실시간 모드 전환
- SSE(Server-Sent Events) 기반 실시간 데이터 수신 구조

## 화면 구성

- **헤더**
  - 서비스 제목
  - 연결 상태 표시
  - 데모 모드 / 실시간 모드 전환 버튼

- **노선도 영역**
  - 2호선 전체 역 표시
  - 열차 마커 표시
  - 선택 열차 강조

- **사이드바**
  - 총 열차 수 / 외선 / 내선 통계
  - 선택 열차 상세 정보
  - 열차 목록

## 기술 스택

- React
- JavaScript (JSX)
- SVG
- SSE(Server-Sent Events)

## 프로젝트 구조 예시

```text
src/
├─ components/
│  ├─ Line2Map.jsx
│  ├─ SubwayMap.jsx
│  ├─ TrainMarker.jsx
│  ├─ TrainList.jsx
│  ├─ DetailPanel.jsx
│  └─ StatsBar.jsx
├─ constants/
│  └─ stations.js
├─ hooks/
│  └─ useSubwaySSE.js
└─ App.jsx
```

## 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 브라우저에서 확인

기본적으로 Vite를 사용한다면 아래 주소에서 확인할 수 있습니다.

```bash
http://localhost:5173
```

## 데이터 연결

`Line2Map.jsx`에서 SSE 엔드포인트를 주입받도록 구성되어 있습니다.

```jsx
<Line2Map sseUrl="http://localhost:8080/api/subway/line2/stream" />
```

데모 데이터와 실시간 데이터를 전환하며 확인할 수 있습니다.

## 열차 데이터 예시

```json
{
  "trainId": "외01",
  "stationCode": "201",
  "nextStationCode": "202",
  "direction": "외선",
  "progress": 0.42,
  "status": "운행중"
}
```

## 커스터마이징 포인트

- `stations.js`
  - 역 목록
  - SVG 캔버스 크기
  - 원형 노선 반지름
  - 라벨 위치 계산
  - 색상 상수

- `SubwayMap.jsx`
  - 선로, 역, 라벨 렌더링
  - 워터마크
  - 전체 SVG 비율 조정

- `TrainMarker.jsx`
  - 열차 마커 크기 및 스타일
  - 선택 표시 방식

- `TrainList.jsx`
  - 열차 목록 UI
  - 외선 / 내선 구분 방식

## 배포 전 체크

- 실시간 SSE 주소를 실제 서버 주소로 변경했는지 확인
- `.env` 사용 시 민감 정보가 Git에 올라가지 않도록 확인
- `node_modules`, `dist` 등이 `.gitignore`에 포함되어 있는지 확인

## GitHub 업로드 순서

```bash
git init
git add .
git commit -m "feat: add line2 realtime subway map"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

## 참고

이 프로젝트는 2호선 순환선 구조를 중심으로 만든 시각화 예시이며,  
실제 운영 환경에서는 실시간 지하철 API 또는 자체 수집 서버와 연결해 사용할 수 있습니다.
