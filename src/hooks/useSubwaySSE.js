import { useEffect, useRef, useState } from "react";

export function useSubwaySSE(url, useMock) {
  const [trains, setTrains] = useState([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (useMock) {
      setConnected(true);

      const timer = setInterval(() => {
        // mock 데이터 갱신
        setTrains((prev) => prev);
      }, 1000);

      return () => clearInterval(timer);
    }

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnected(true);
    };

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setTrains(data);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
    };

    return () => {
      es.close();
    };
  }, [url, useMock]);

  return { trains, connected };
}
