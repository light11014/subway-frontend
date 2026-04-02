import { STATIONS, CODE_IDX, COLOR } from "../constants/stations.js";

export default function DetailPanel({ train, onClose }) {
  if (!train) return null;

  const col       = train.direction === "외선" ? COLOR.outer : COLOR.inner;
  const borderCol = train.direction === "외선" ? COLOR.outerLight : COLOR.innerLight;
  const fromName  = STATIONS[CODE_IDX[train.stationCode]]?.name ?? "—";
  const toName    = STATIONS[CODE_IDX[train.nextStationCode]]?.name ?? "—";
  const pct       = Math.round((train.progress ?? 0) * 100);

  return (
    <div style={{
      background: "#fff",
      border: `0.5px solid ${borderCol}`,
      borderRadius: "8px",
      padding: "10px 12px",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "32px", height: "16px", borderRadius: "3px",
            background: col, display: "flex", alignItems: "center",
            justifyContent: "center", color: "#fff", fontSize: "9px", fontWeight: 500,
          }}>
            {train.trainId}
          </div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: "#111827" }}>
              {train.trainId} 열차
            </div>
            <div style={{ fontSize: "10px", color: col }}>
              {train.direction === "외선" ? "외선 (바깥)" : "내선 (안쪽)"}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", fontSize: "16px",
          color: "#9CA3AF", cursor: "pointer", lineHeight: 1,
        }}>×</button>
      </div>

      <div style={{ fontSize: "11px", color: "#374151", marginBottom: "7px" }}>
        {fromName}
        <span style={{ color: "#D1D5DB", margin: "0 5px" }}>→</span>
        {toName}
      </div>

      <div style={{ height: "3px", borderRadius: "2px", background: "#F3F4F6", marginBottom: "4px" }}>
        <div style={{
          height: "100%", borderRadius: "2px", background: col,
          width: `${pct}%`, transition: "width .05s linear",
        }} />
      </div>
      <div style={{ fontSize: "10px", color: "#9CA3AF" }}>
        {pct}% · {train.status}
      </div>
    </div>
  );
}
