import { STATIONS, CODE_IDX, COLOR } from "../constants/stations.js";

export default function TrainList({
  trains,
  selected,
  onSelect,
  activeTab,
  onChangeTab,
  outerCount,
  innerCount,
}) {
  const tabs = [
    { key: "외선", label: "외선", count: outerCount, color: COLOR.outer },
    { key: "내선", label: "내선", count: innerCount, color: COLOR.inner },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {/* 탭 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #E5E7EB",
          marginBottom: "2px",
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                borderBottom: active
                  ? `2px solid ${tab.color}`
                  : "2px solid transparent",
                padding: "10px 0 9px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "14px",
                fontWeight: active ? 700 : 500,
                color: active ? "#111827" : "#9CA3AF",
              }}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {trains.map((train) => {
          const isOuter = train.direction === "외선";
          const col = isOuter ? COLOR.outer : COLOR.inner;
          const isSel = selected === train.trainId;
          const fromName = STATIONS[CODE_IDX[train.stationCode]]?.name ?? "";
          const toName = STATIONS[CODE_IDX[train.nextStationCode]]?.name ?? "";
          const pct = Math.round((train.progress ?? 0) * 100);

          return (
            <div
              key={train.trainId}
              onClick={() => onSelect(train.trainId)}
              style={{
                borderRadius: "10px",
                padding: "12px 12px",
                cursor: "pointer",
                border: `1px solid ${isSel ? col : "#E5E7EB"}`,
                background: isSel ? (isOuter ? "#EFF6FF" : "#FEF2F2") : "#fff",
                transition: "all .1s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "7px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "16px",
                      borderRadius: "3px",
                      background: col,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {train.trainId.replace(/[^\d]/g, "").slice(-2)}
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {train.trainId}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: isOuter ? "#EFF6FF" : "#FEF2F2",
                    color: col,
                    fontWeight: 600,
                  }}
                >
                  {train.direction}
                </span>
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  marginBottom: "7px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {fromName} → {toName}
              </div>

              <div
                style={{
                  height: "4px",
                  borderRadius: "999px",
                  background: "#F3F4F6",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: "999px",
                    background: col,
                    width: `${pct}%`,
                    transition: "width .05s linear",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
