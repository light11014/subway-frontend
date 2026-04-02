import { useState, useEffect, useRef } from "react";
import { STATIONS, CODE_IDX, N, nextStIdx } from "../constants/stations.js";

// ─── 데모용 초기 열차 목록 ────────────────────────────────────────────────────
function makeInitialTrains() {
  const outerSeeds = [0, 7, 14, 21, 29, 36];
  const innerSeeds = [4, 12, 20, 30, 38];

  return [
    ...outerSeeds.map((si, i) => ({
      trainId: `외${String(i + 1).padStart(2, "0")}`,
      stationCode: STATIONS[si].code,
      nextStationCode: STATIONS[(si + 1) % N].code,
      direction: "외선",
      status: "운행중",
      progress: Math.random() * 0.7,
    })),
    ...innerSeeds.map((si, i) => ({
      trainId: `내${String(i + 1).padStart(2, "0")}`,
      stationCode: STATIONS[si].code,
      nextStationCode: STATIONS[(si - 1 + N) % N].code,
      direction: "내선",
      status: "운행중",
      progress: Math.random() * 0.7,
    })),
  ];
}

/**
 * useSubwaySSE
 *
 * useMock=true  → 50ms 인터벌로 열차 위치를 자체 시뮬레이션
 * useMock=false → Spring WebFlux SSE 엔드포인트에 EventSource 연결
 *
 * Spring WebFlux 서버 이벤트 형식:
 *   event: train-update
 *   data: {
 *     trainId: string,
 *     stationCode: string,        // "201" ~ "243"
 *     nextStationCode: string,
 *     direction: "외선" | "내선",
 *     status: string,             // "운행중" | "도착" | "출발대기"
 *     progress: number            // 0.0 ~ 1.0
 *   }
 */
export function useSubwaySSE(url, useMock) {
  const [trains, setTrains] = useState(() =>
    useMock ? makeInitialTrains() : []
  );
  const [connected, setConnected] = useState(false);
  const timerRef = useRef(null);

  // ── 데모 모드 ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!useMock) return;

    setConnected(true);
    timerRef.current = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => {
          const p = train.progress + 0.013;
          if (p >= 1) {
            const toIdx = CODE_IDX[train.nextStationCode];
            return {
              ...train,
              stationCode: train.nextStationCode,
              nextStationCode: STATIONS[nextStIdx(toIdx, train.direction)].code,
              progress: 0,
              status: "출발",
            };
          }
          return { ...train, progress: p, status: "운행중" };
        })
      );
    }, 50);

    return () => {
      clearInterval(timerRef.current);
      setConnected(false);
    };
  }, [useMock]);

  // ── 실시간 SSE 모드 ────────────────────────────────────────────────────────
  useEffect(() => {
    if (useMock) return;

    let es;
    try {
      es = new EventSource(url);
      es.onopen = () => setConnected(true);
      es.onerror = () => setConnected(false);

      const merge = (data) => {
        setTrains((prev) => {
          const idx = prev.findIndex((t) => t.trainId === data.trainId);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], ...data };
            return next;
          }
          return [...prev, { progress: 0, ...data }];
        });
      };

      // Spring WebFlux: ServerSentEvent.builder(data).event("train-update").build()
      es.addEventListener("train-update", (e) => {
        try { merge(JSON.parse(e.data)); } catch (_) {}
      });

      // 이벤트명 없이 data만 전송하는 경우 대비
      es.onmessage = (e) => {
        try {
          const d = JSON.parse(e.data);
          if (d.trainId) merge(d);
        } catch (_) {}
      };
    } catch (err) {
      console.error("[SSE] 연결 실패:", err);
    }

    return () => {
      es?.close();
      setConnected(false);
    };
  }, [url, useMock]);

  return { trains, connected };
}
