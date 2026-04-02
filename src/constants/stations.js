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
export const SVG_W = 980;
export const SVG_H = 680;
export const CX = SVG_W / 2;
export const CY = SVG_H / 2 + 8;

/**
 * 캡슐형(stadium) 궤도 파라미터
 * - HALF_STRAIGHT: 위/아래 직선이 중심에서 좌우로 뻗는 절반 길이
 * - ARC_R: 좌우 반원 반지름
 *
 * 전체 폭  = 2 * HALF_STRAIGHT + 2 * ARC_R
 * 전체 높이 = 2 * ARC_R
 */
export const HALF_STRAIGHT = 210;
export const ARC_R = 185;

/** 열차를 선로에서 얼마나 띄울지 */
export const OFFSET = 11;

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

/**
 * 캡슐형(stadium) 둘레 길이
 * 시작점은 "맨 위 중앙", 시계방향 진행
 *
 * 구간 순서:
 * 1) 위 중앙 → 위 오른쪽 직선
 * 2) 오른쪽 반원 (위 → 아래)
 * 3) 아래 직선 (오른쪽 → 왼쪽)
 * 4) 왼쪽 반원 (아래 → 위)
 * 5) 위 왼쪽 직선 → 위 중앙
 */
export const PERIMETER =
  HALF_STRAIGHT + // top right half
  Math.PI * ARC_R + // right arc
  HALF_STRAIGHT * 2 + // bottom straight
  Math.PI * ARC_R + // left arc
  HALF_STRAIGHT; // top left half

/**
 * 둘레 거리 s(0 ~ PERIMETER) 위치의 점과 바깥쪽 법선 벡터 계산
 */
export function pointOnCapsule(s) {
  let d = ((s % PERIMETER) + PERIMETER) % PERIMETER;

  // 1) 위 중앙 -> 위 오른쪽 직선
  if (d <= HALF_STRAIGHT) {
    return {
      x: CX + d,
      y: CY - ARC_R,
      nx: 0,
      ny: -1,
    };
  }
  d -= HALF_STRAIGHT;

  // 2) 오른쪽 반원 (위 -> 아래)
  if (d <= Math.PI * ARC_R) {
    const theta = -Math.PI / 2 + d / ARC_R;
    const nx = Math.cos(theta);
    const ny = Math.sin(theta);
    return {
      x: CX + HALF_STRAIGHT + ARC_R * nx,
      y: CY + ARC_R * ny,
      nx,
      ny,
    };
  }
  d -= Math.PI * ARC_R;

  // 3) 아래 직선 (오른쪽 -> 왼쪽)
  if (d <= HALF_STRAIGHT * 2) {
    return {
      x: CX + HALF_STRAIGHT - d,
      y: CY + ARC_R,
      nx: 0,
      ny: 1,
    };
  }
  d -= HALF_STRAIGHT * 2;

  // 4) 왼쪽 반원 (아래 -> 위)
  if (d <= Math.PI * ARC_R) {
    const theta = Math.PI / 2 + d / ARC_R;
    const nx = Math.cos(theta);
    const ny = Math.sin(theta);
    return {
      x: CX - HALF_STRAIGHT + ARC_R * nx,
      y: CY + ARC_R * ny,
      nx,
      ny,
    };
  }
  d -= Math.PI * ARC_R;

  // 5) 위 왼쪽 직선 (왼쪽 -> 중앙)
  return {
    x: CX - HALF_STRAIGHT + d,
    y: CY - ARC_R,
    nx: 0,
    ny: -1,
  };
}

/** 역 인덱스 → 선로 위 SVG 좌표 */
export function stationPos(i) {
  const s = (i / N) * PERIMETER;
  const p = pointOnCapsule(s);
  return { x: p.x, y: p.y, s };
}

export const POSITIONS = STATIONS.map((s, i) => ({ ...s, ...stationPos(i) }));

/**
 * 두 역 코드 사이의 progress(0~1) 위치
 * direction:
 * - 외선: 시계방향
 * - 내선: 반시계방향
 */
export function lerpOnTrack(fromCode, toCode, progress, direction) {
  const fi = CODE_IDX[fromCode];
  const ti = CODE_IDX[toCode];
  if (fi == null || ti == null) return null;

  const fs = (fi / N) * PERIMETER;
  const ts = (ti / N) * PERIMETER;

  let ds = ts - fs;

  // 외선(시계방향): 음수면 한 바퀴 더함
  if (direction === "외선" && ds < 0) ds += PERIMETER;

  // 내선(반시계방향): 양수면 반시계 shortest가 아니라 한 바퀴 반대로
  if (direction === "내선" && ds > 0) ds -= PERIMETER;

  const s = fs + ds * progress;
  const p = pointOnCapsule(s);

  return {
    x: p.x,
    y: p.y,
    s,
    nx: p.nx,
    ny: p.ny,
  };
}

/**
 * 선로 위 좌표를 바깥/안쪽으로 OFFSET 이동
 */
export function radialOffset(x, y, direction) {
  const p = nearestNormalOnCapsule(x, y);
  const sign = direction === "외선" ? 1 : -1;

  return {
    x: x + sign * p.nx * OFFSET,
    y: y + sign * p.ny * OFFSET,
  };
}

/**
 * 주어진 점에 대해 캡슐 위의 바깥쪽 법선을 근사 계산
 * - 위/아래 직선 구간은 수직 법선
 * - 좌우 반원 구간은 원 중심 기준 방사 법선
 */
export function nearestNormalOnCapsule(x, y) {
  const rightCx = CX + HALF_STRAIGHT;
  const leftCx = CX - HALF_STRAIGHT;

  // 위/아래 직선 구간 판정
  if (x >= leftCx && x <= rightCx) {
    if (y < CY) return { nx: 0, ny: -1 };
    return { nx: 0, ny: 1 };
  }

  // 오른쪽 반원
  if (x > rightCx) {
    const dx = x - rightCx;
    const dy = y - CY;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return { nx: dx / len, ny: dy / len };
  }

  // 왼쪽 반원
  const dx = x - leftCx;
  const dy = y - CY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { nx: dx / len, ny: dy / len };
}

/** 다음 역 인덱스 (방향별) */
export function nextStIdx(idx, direction) {
  return direction === "외선" ? (idx + 1) % N : (idx - 1 + N) % N;
}

/**
 * 역명 라벨 위치
 * - 선로 가까이에 붙이되
 * - 짝/홀수로 살짝만 벌림
 * - 일부 역은 소폭 보정
 */
export function labelPos(i) {
  const s = (i / N) * PERIMETER;
  const p = pointOnCapsule(s);

  const dist = i % 2 === 0 ? 16 : 24;

  let lx = p.x + p.nx * dist;
  let ly = p.y + p.ny * dist;

  const station = STATIONS[i];

  const adjust = {
    203: { dx: -8, dy: -6 }, // 을지로3가
    204: { dx: 8, dy: -6 }, // 을지로4가
    205: { dx: 14, dy: -2 }, // 동대문역사문화공원
    206: { dx: 10, dy: -6 }, // 신당
    216: { dx: 6, dy: 4 }, // 잠실
    217: { dx: 8, dy: 4 }, // 잠실새내
    218: { dx: 8, dy: 4 }, // 종합운동장
    232: { dx: -6, dy: 0 }, // 구로디지털단지
  };

  if (adjust[station.code]) {
    lx += adjust[station.code].dx;
    ly += adjust[station.code].dy;
  }

  return {
    lx,
    ly,
    anchor: p.nx > 0.25 ? "start" : p.nx < -0.25 ? "end" : "middle",
  };
}
