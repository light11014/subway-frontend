import {
  POSITIONS,
  SVG_W,
  SVG_H,
  CX,
  CY,
  HALF_STRAIGHT,
  ARC_R,
  COLOR,
  labelPos,
} from "../constants/stations.js";
import TrainMarker from "./TrainMarker.jsx";

/** 캡슐형 선로 path */
function buildCapsulePath(inset = 0) {
  const r = ARC_R - inset;
  const half = HALF_STRAIGHT;

  const leftX = CX - half;
  const rightX = CX + half;
  const topY = CY - r;
  const bottomY = CY + r;

  return [
    `M ${leftX} ${topY}`,
    `L ${rightX} ${topY}`,
    `A ${r} ${r} 0 0 1 ${rightX} ${bottomY}`,
    `L ${leftX} ${bottomY}`,
    `A ${r} ${r} 0 0 1 ${leftX} ${topY}`,
    "Z",
  ].join(" ");
}

export default function SubwayMap({ trains, selected, onSelectTrain }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 내부 배경 */}
        <path d={buildCapsulePath(6)} fill={COLOR.trackFill} />

        {/* 선로 */}
        <path
          d={buildCapsulePath(0)}
          fill="none"
          stroke={COLOR.track}
          strokeWidth={8}
          strokeLinejoin="round"
        />

        {/* 역 도트 */}
        {POSITIONS.map((p) => (
          <circle
            key={p.code}
            cx={p.x}
            cy={p.y}
            r={4.5}
            fill="#fff"
            stroke={COLOR.stationDot}
            strokeWidth={1.6}
          />
        ))}

        {/* 역명 */}
        {POSITIONS.map((p, i) => {
          const { lx, ly, anchor } = labelPos(i);
          return (
            <text
              key={p.code}
              x={lx}
              y={ly}
              textAnchor={anchor}
              dominantBaseline="middle"
              fill={COLOR.labelColor}
              fontSize={11.5}
              fontWeight={600}
              fontFamily="'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"
            >
              {p.name}
            </text>
          );
        })}

        {/* 내선 */}
        {trains
          .filter((t) => t.direction === "내선")
          .map((train) => (
            <TrainMarker
              key={train.trainId}
              train={train}
              isSelected={selected === train.trainId}
              onClick={() => onSelectTrain(train.trainId)}
            />
          ))}

        {/* 외선 */}
        {trains
          .filter((t) => t.direction === "외선")
          .map((train) => (
            <TrainMarker
              key={train.trainId}
              train={train}
              isSelected={selected === train.trainId}
              onClick={() => onSelectTrain(train.trainId)}
            />
          ))}

        {/* 중앙 워터마크 */}
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#cde9d5"
          fontSize={92}
          fontWeight="bold"
          fontFamily="'Apple SD Gothic Neo', sans-serif"
        >
          2
        </text>
        <text
          x={CX}
          y={CY + 50}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#b0d9bc"
          fontSize={22}
          fontWeight={600}
          fontFamily="'Apple SD Gothic Neo', sans-serif"
        >
          호선
        </text>
      </svg>
    </div>
  );
}
