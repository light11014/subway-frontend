import { COLOR } from "../constants/stations.js";

export default function StatsBar({ total, outerCount, innerCount }) {
  const items = [
    {
      label: "TOTAL",
      value: total,
      color: "#111827",
      border: "#E5E7EB",
      labelColor: "#9CA3AF",
    },
    {
      label: "외선",
      value: outerCount,
      color: COLOR.outer,
      border: COLOR.outerLight,
      labelColor: "#3B82F6",
    },
    {
      label: "내선",
      value: innerCount,
      color: COLOR.inner,
      border: COLOR.innerLight,
      labelColor: "#EF4444",
    },
  ];

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "nowrap" }}>
      {items.map(({ label, value, color, border, labelColor }) => (
        <div
          key={label}
          style={{
            flex: 1,
            minWidth: 0,
            background: "#fff",
            border: `1px solid ${border}`,
            borderRadius: "12px",
            padding: "14px 10px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: labelColor,
              letterSpacing: ".4px",
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            {label}
          </div>
          <div
            style={{ fontSize: "34px", fontWeight: 700, color, lineHeight: 1 }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
