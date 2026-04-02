import { useEffect, useMemo, useRef, useState } from "react";
import { N, COLOR } from "../constants/stations.js";
import { useSubwaySSE } from "../hooks/useSubwaySSE.js";
import SubwayMap from "./SubwayMap.jsx";
import StatsBar from "./StatsBar.jsx";
import DetailPanel from "./DetailPanel.jsx";
import TrainList from "./TrainList.jsx";

export default function Line2Map({
  sseUrl = "http://localhost:8080/api/subway/line2/stream",
}) {
  const [selected, setSelected] = useState(null);
  const [listVisible, setListVisible] = useState(true);

  // 서버 원본 데이터
  const { trains, connected } = useSubwaySSE(sseUrl);

  // 화면에 그릴 애니메이션용 데이터
  const [animatedTrains, setAnimatedTrains] = useState([]);
  const targetRef = useRef([]);

  // 서버에서 새 데이터 오면 target 갱신
  useEffect(() => {
    targetRef.current = trains;
  }, [trains]);

  // 부드럽게 progress 보간
  useEffect(() => {
    let frameId;

    const animate = () => {
      setAnimatedTrains((prev) => {
        const prevMap = new Map(prev.map((t) => [t.trainId, t]));
        const next = targetRef.current.map((target) => {
          const current = prevMap.get(target.trainId);

          // 새로 들어온 열차면 바로 표시
          if (!current) return target;

          // 구간이 바뀌면 점프 허용
          if (
            current.stationCode !== target.stationCode ||
            current.nextStationCode !== target.nextStationCode ||
            current.direction !== target.direction
          ) {
            return target;
          }

          const currentProgress = current.progress ?? 0;
          const targetProgress = target.progress ?? 0;
          const diff = targetProgress - currentProgress;

          // 충분히 가까우면 target으로 맞춤
          if (Math.abs(diff) < 0.002) {
            return { ...target, progress: targetProgress };
          }

          // 부드럽게 따라가기
          return {
            ...target,
            progress: currentProgress + diff * 0.15,
          };
        });

        return next;
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const outerCount = trains.filter((t) => t.direction === "외선").length;
  const innerCount = trains.filter((t) => t.direction === "내선").length;

  const selectedTrain = selected
    ? (animatedTrains.find((t) => t.trainId === selected) ??
      trains.find((t) => t.trainId === selected) ??
      null)
    : null;

  function toggleSelect(id) {
    setSelected((prev) => (prev === id ? null : id));
  }

  const listTrains = useMemo(() => animatedTrains, [animatedTrains]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#fff",
        fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        color: "#111827",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: "70px",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: COLOR.track,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "22px",
              flexShrink: 0,
            }}
          >
            2
          </div>

          <div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                letterSpacing: "-0.4px",
                lineHeight: 1.2,
              }}
            >
              2호선 실시간 운행 현황
            </div>
            <div
              style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}
            >
              Seoul Metro Line 2 · {N} stations
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "8px 12px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: connected ? COLOR.track : "#9CA3AF",
                animation: connected ? "blink 2s infinite" : "none",
              }}
            />
            <span
              style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}
            >
              {connected ? "LIVE" : "오프라인"}
            </span>
          </div>
        </div>
      </div>

      {/* 바디 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* 왼쪽 지도 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
            padding: "18px 16px 10px 22px",
          }}
        >
          <div style={{ flex: 1, minHeight: 0 }}>
            <SubwayMap
              trains={animatedTrains}
              selected={selected}
              onSelectTrain={toggleSelect}
            />
          </div>

          <div
            style={{
              flexShrink: 0,
              display: "flex",
              gap: "24px",
              alignItems: "center",
              padding: "10px 6px",
            }}
          >
            {[
              { col: COLOR.outer, label: "외선 — 원 바깥쪽" },
              { col: COLOR.inner, label: "내선 — 원 안쪽" },
            ].map(({ col, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "14px",
                    borderRadius: "3px",
                    background: col,
                  }}
                />
                <span style={{ fontSize: "13px", color: "#6B7280" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <div
          style={{
            width: "320px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderLeft: "1px solid #E5E7EB",
            overflow: "hidden",
          }}
        >
          <div style={{ flexShrink: 0, padding: "16px 16px 12px" }}>
            <StatsBar
              total={trains.length}
              outerCount={outerCount}
              innerCount={innerCount}
            />
          </div>

          {selectedTrain && (
            <div style={{ flexShrink: 0, padding: "0 16px 12px" }}>
              <DetailPanel
                train={selectedTrain}
                onClose={() => setSelected(null)}
              />
            </div>
          )}

          <div
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px 10px",
            }}
          >
            <span
              style={{ fontSize: "14px", color: "#6B7280", fontWeight: 600 }}
            >
              열차 목록 ({trains.length})
            </span>

            <button
              onClick={() => setListVisible((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: "none",
                border: "none",
                fontSize: "13px",
                color: "#9CA3AF",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              <span style={{ fontSize: "10px" }}>
                {listVisible ? "▾" : "▸"}
              </span>
              {listVisible ? "숨기기" : "보기"}
            </button>
          </div>

          {listVisible && (
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0 16px 16px",
                minHeight: 0,
              }}
            >
              <TrainList
                trains={listTrains}
                selected={selected}
                onSelect={toggleSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
