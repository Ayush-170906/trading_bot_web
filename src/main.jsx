import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgba(13, 18, 31, 0.95)",
          color: "#e2e8f0",
          border: "1px solid rgba(34, 211, 238, 0.2)",
          borderRadius: "12px",
          backdropFilter: "blur(12px)",
          fontSize: "13px",
        },
        success: { iconTheme: { primary: "#34d399", secondary: "#0B0F19" } },
        error: { iconTheme: { primary: "#fb7185", secondary: "#0B0F19" } },
      }}
    />
  </StrictMode>
);
