import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { installSessionExpiryInterceptor } from "@/lib/session-expiry";

installSessionExpiryInterceptor(import.meta.env.VITE_API_BASE_URL);

createRoot(document.getElementById("root")!).render(<App />);
