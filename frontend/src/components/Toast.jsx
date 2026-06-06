import { useState, useCallback, useEffect } from "react";

let toastQueue = [];
let setToastsGlobal = null;

export const toast = {
  success: (msg) => addToast(msg, "success"),
  error: (msg) => addToast(msg, "error"),
  info: (msg) => addToast(msg, "info"),
};

function addToast(message, type) {
  const id = Date.now();
  if (setToastsGlobal) {
    setToastsGlobal((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToastsGlobal((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setToastsGlobal = setToasts;
    return () => { setToastsGlobal = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem",
      display: "flex", flexDirection: "column", gap: "0.5rem", zIndex: 9999,
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.type === "success" ? "rgba(16,185,129,0.15)" : t.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(124,106,255,0.15)",
            border: `1px solid ${t.type === "success" ? "rgba(16,185,129,0.4)" : t.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(124,106,255,0.4)"}`,
            color: t.type === "success" ? "#10B981" : t.type === "error" ? "#EF4444" : "#B69AFF",
            padding: "0.75rem 1.25rem",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontWeight: "500",
            backdropFilter: "blur(12px)",
            animation: "fadeUp 0.3s ease",
            maxWidth: "320px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
