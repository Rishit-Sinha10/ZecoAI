import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function PromptModal({ isOpen, onClose, onSubmit, title, placeholder, defaultValue = "", multiline = false }) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      onClose();
    }
  };

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", accent: "var(--accent)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg3 }}>
          <h2 className="text-lg font-semibold" style={{ color: t.text }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: t.text3 }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {multiline ? (
            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              rows={6}
              className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors resize-none text-sm font-mono"
              style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text }}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors text-sm"
              style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text }}
            />
          )}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg transition-colors" style={{ color: t.text2, backgroundColor: t.bg3, border: `1px solid ${t.border}` }}>
              Cancel
            </button>
            <button type="submit" disabled={!value.trim()} className="px-4 py-2 text-sm text-white rounded-lg transition-colors disabled:opacity-50" style={{ backgroundColor: t.accent }}>
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
