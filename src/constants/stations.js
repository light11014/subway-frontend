// ─── 2호선 43개 역 (순환선, 201~243) ──────────────────────────────────────────
export const STATIONS = [
  { code: "201", name: "시청" },
  { code: "202", name: "을지로입구" },
  { code: "203", name: "을지로3가" },
  { code: "204", name: "을지로4가" },
  { code: "205", name: "동대문역사문화공원" },
  { code: "206", name: "신당" },
  { code: "207", name: "상왕십리" },
  { code: "208", name: "왕십리" },
  { code: "209", name: "한양대" },
  { code: "210", name: "뚝섬" },
  { code: "211", name: "성수" },
  { code: "212", name: "건대입구" },
  { code: "213", name: "구의" },
  { code: "214", name: "강변" },
  { code: "215", name: "잠실나루" },
  { code: "216", name: "잠실" },
  { code: "217", name: "잠실새내" },
  { code: "218", name: "종합운동장" },
  { code: "219", name: "삼성" },
  { code: "220", name: "선릉" },
  { code: "221", name: "역삼" },
  { code: "222", name: "강남" },
  { code: "223", name: "교대" },
  { code: "224", name: "서초" },
  { code: "225", name: "방배" },
  { code: "226", name: "사당" },
  { code: "227", name: "낙성대" },
  { code: "228", name: "서울대입구" },
  { code: "229", name: "봉천" },
  { code: "230", name: "신림" },
  { code: "231", name: "신대방" },
  { code: "232", name: "구로디지털단지" },
  { code: "233", name: "대림" },
  { code: "234", name: "신도림" },
  { code: "235", name: "문래" },
  { code: "236", name: "영등포구청" },
  { code: "237", name: "당산" },
  { code: "238", name: "합정" },
  { code: "239", name: "홍대입구" },
  { code: "240", name: "신촌" },
  { code: "241", name: "이대" },
  { code: "242", name: "아현" },
  { code: "243", name: "충정로" },
];

export const N = STATIONS.length;

/** 역코드 → 인덱스 빠른 조회 */
export const CODE_IDX = Object.fromEntries(STATIONS.map((s, i) => [s.code, i]));

// ─── SVG 캔버스 레이아웃 ───────────────────────────────────────────────────────
// 라벨 공간 확보를 위해 가로를 충분히 넓게 설정
export const SVG_W = 860;
export const SVG_H = 580;
export const CX = SVG_W / 2;
export const CY = SVG_H / 2 + 8;
export const RX = 300;
export const RY = 235;

/**
 * OFFSET: 선로 스트로크 절반(3.5) + 열차 박스 절반(7) = 10.5 ≈ 11
 * → 박스가 선로 위에 딱 얹힌 것처럼 보임
 */
export const OFFSET = 19;

// ─── 색상 ──────────────────────────────────────────────────────────────────────
export const COLOR = {
  track: "#00A84D",
  trackFill: "#edf8f1",
  outer: "#1D4ED8",
  outerLight: "#DBEAFE",
  outerText: "#1E40AF",
  inner: "#B91C1C",
  innerLight: "#FEE2E2",
  innerText: "#991B1B",
  stationDot: "#009040",
  stationDotMinor: "#52b97a",
  labelColor: "#4B5563",
};

// ─── 좌표 계산 유틸 ────────────────────────────────────────────────────────────

/** 역 인덱스 → 선로 위 SVG 좌표 */
export function stationPos(i) {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a), a };
}

export const POSITIONS = STATIONS.map((s, i) => ({ ...s, ...stationPos(i) }));

/**
 * 두 역 코드 사이의 progress(0~1) 위치 — 타원 호(arc) 위에서 보간
 * 직선 보간(lerp) 대신 각도 보간을 사용해 열차가 선로 위를 정확히 따라가도록 함
 */
export function lerpOnTrack(fromCode, toCode, progress, direction) {
  const fi = CODE_IDX[fromCode];
  const ti = CODE_IDX[toCode];
  if (fi == null || ti == null) return null;

  const fa = (fi / N) * Math.PI * 2 - Math.PI / 2;
  let ta = (ti / N) * Math.PI * 2 - Math.PI / 2;

  let da = ta - fa;
  // 외선(시계방향): da가 음수(wrap)면 2π 더함
  // 내선(반시계방향): da가 양수(wrap)면 2π 뺌
  if (direction === "외선" && da < -0.01) da += 2 * Math.PI;
  if (direction === "내선" && da > 0.01) da -= 2 * Math.PI;

  const a = fa + da * progress;
  return {
    x: CX + RX * Math.cos(a),
    y: CY + RY * Math.sin(a),
    a,
  };
}

/**
 * 선로 위 좌표를 중심에서 방사 방향으로 OFFSET 이동
 * direction: "외선" → 바깥(+), "내선" → 안쪽(-)
 */
export function radialOffset(x, y, direction) {
  const dx = x - CX,
    dy = y - CY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const sign = direction === "외선" ? 1 : -1;
  return {
    x: x + sign * (dx / len) * OFFSET,
    y: y + sign * (dy / len) * OFFSET,
  };
}

/** 다음 역 인덱스 (방향별) */
export function nextStIdx(idx, direction) {
  return direction === "외선" ? (idx + 1) % N : (idx - 1 + N) % N;
}

/**
 * 역명 라벨 위치
 * 인접 역 겹침 방지를 위해 짝수/홀수 인덱스를 교호(alternating) 거리로 배치
 */
export function labelPos(i) {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;

  const dist = i % 2 === 0 ? 16 : 20;

  const lx = CX + (RX + dist) * Math.cos(a);
  const ly = CY + (RY + dist) * Math.sin(a);
  const ca = Math.cos(a);

  return {
    lx,
    ly,
    anchor: ca > 0.15 ? "start" : ca < -0.15 ? "end" : "middle",
  };
}
