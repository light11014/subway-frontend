import { lerpOnTrack, radialOffset, COLOR } from "../constants/stations.js";

const BOX_W = 36;
const BOX_H = 18;
const BOX_R = 4;

export default function TrainMarker({ train, isSelected, onClick }) {
  const raw = lerpOnTrack(
    train.stationCode,
    train.nextStationCode,
    train.progress ?? 0,
    train.direction,
  );
  if (!raw) return null;

  const { x, y } = radialOffset(raw.x, raw.y, train.direction);
  const col = train.direction === "외선" ? COLOR.outer : COLOR.inner;
  const label = train.trainId.replace(/[^\d]/g, "").slice(-2);

  return (
    <g
      transform={`translate(${x.toFixed(2)}, ${y.toFixed(2)})`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {isSelected && (
        <rect
          x={-(BOX_W / 2 + 7)}
          y={-(BOX_H / 2 + 7)}
          width={BOX_W + 14}
          height={BOX_H + 14}
          rx={BOX_R + 4}
          fill={col}
          opacity={0.18}
        />
      )}

      <rect
        x={-BOX_W / 2}
        y={-BOX_H / 2}
        width={BOX_W}
        height={BOX_H}
        rx={BOX_R}
        fill={col}
        stroke={isSelected ? "#fff" : "none"}
        strokeWidth={isSelected ? 1.5 : 0}
      />

      <text
        x={0}
        y={0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={11}
        fontWeight="700"
        fontFamily="'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"
        style={{ userSelect: "none", pointerEvents: "none" }}
      >
        {label}
      </text>
    </g>
  );
}
