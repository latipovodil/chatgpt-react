import { Routes, Route } from "react-router-dom";
import "./global.scss";
import Home from "./pages/home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<h1>Page not found!!!</h1>} />
    </Routes>
  );
}
