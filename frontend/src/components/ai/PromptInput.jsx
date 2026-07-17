import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

function PromptInput({ onSubmit, isLoading, placeholder = "Ask ZecoAI..." }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", accent: "var(--accent)",
  };

  return (
    <form onSubmit={handleSubmit} className="p-4" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bg3 }}>
      <div className="flex gap-3 items-end">
        <div className="flex-1 flex items-end gap-2">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder={placeholder} disabled={isLoading} rows="3"
            className="flex-1 rounded-lg px-4 py-3 focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}`, color: t.text }} />
        </div>
        <button type="submit" disabled={!input.trim() || isLoading}
          className="flex items-center gap-2 text-white px-4 py-3 rounded-lg transition-colors font-medium h-fit disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--accent)" }}
          title="Send message (Ctrl+Enter)">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Thinking...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span className="hidden sm:inline">Ask AI</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs mt-2" style={{ color: t.text3 }}>Tip: Use Shift+Enter for line breaks, Enter to send</p>
    </form>
  );
}

export default PromptInput;
