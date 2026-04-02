import {
  STATIONS,
  POSITIONS,
  SVG_W,
  SVG_H,
  CX,
  CY,
  RX,
  RY,
  COLOR,
  labelPos,
} from "../constants/stations.js";
import TrainMarker from "./TrainMarker.jsx";

function buildTrackPath() {
  const pts = POSITIONS.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(
    " ",
  );
  return `M ${pts} Z`;
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
        <ellipse
          cx={CX}
          cy={CY}
          rx={RX - 2}
          ry={RY - 2}
          fill={COLOR.trackFill}
        />

        <path
          d={buildTrackPath()}
          fill="none"
          stroke={COLOR.track}
          strokeWidth={10}
          strokeLinejoin="round"
        />

        {POSITIONS.map((p) => (
          <circle
            key={p.code}
            cx={p.x}
            cy={p.y}
            r={5.8}
            fill="#fff"
            stroke={COLOR.stationDot}
            strokeWidth={2}
          />
        ))}

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
              fontSize={11.0}
              fontWeight={500}
              fontFamily="'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"
            >
              {p.name}
            </text>
          );
        })}

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
          y={CY + 52}
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
