import Line2Map from "./components/Line2Map.jsx";

export default function App() {
  return <Line2Map sseUrl="http://localhost:8080/api/subway/stream" />;
}
