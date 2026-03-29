import { createRoot } from "react-dom/client";
import "./index.css";
import { initTheme } from "./lib/theme";
import App from "./App.tsx";

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
