import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: { bg: "#10b981", text: "white" },
  error: { bg: "#ef4444", text: "white" },
  info: { bg: "var(--accent)", text: "white" },
  warning: { bg: "#f59e0b", text: "black" },
};

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: "380px" }}>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const Icon = icons[toast.type] || Info;
  const style = colors[toast.type] || colors.info;

  useEffect(() => {
    const el = document.getElementById(`toast-${toast.id}`);
    if (el) {
      el.style.animation = "toastIn 200ms cubic-bezier(0.16,1,0.3,1) forwards";
    }
  }, [toast.id]);

  return (
    <div
      id={`toast-${toast.id}`}
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        animation: "toastIn 200ms cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      <Icon size={18} style={{ color: style.bg, flexShrink: 0 }} />
      <p className="text-sm font-medium flex-1" style={{ color: "var(--text-primary)" }}>{toast.message}</p>
      <button onClick={onClose} className="p-1 rounded transition-colors flex-shrink-0" style={{ color: "var(--text-tertiary)" }}>
        <X size={14} />
      </button>
    </div>
  );
}
