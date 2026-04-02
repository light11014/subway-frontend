# 서울 지하철 2호선 실시간 운행 시각화
서울 지하철 2호선의 운행 현황을 원형 노선도로 시각화한 React 기반 프로젝트입니다.  
열차 위치, 진행 방향(외선 / 내선), 선택 열차 상세 정보, 열차 목록을 한 화면에서 확인할 수 있습니다.

<img width="1918" height="861" alt="image" src="https://github.com/user-attachments/assets/8108d527-ce89-482e-bdb4-1dd69c02d9f1" />




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
