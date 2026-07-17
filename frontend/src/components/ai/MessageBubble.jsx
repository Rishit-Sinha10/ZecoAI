import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";

function MessageBubble({ message, isUser }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative group"
        style={{
          backgroundColor: isUser ? "var(--accent)" : "var(--bg-tertiary)",
          color: isUser ? "white" : "var(--text-primary)",
          borderRadius: isUser ? undefined : undefined,
          borderBottomRightRadius: isUser ? 0 : undefined,
          borderBottomLeftRadius: !isUser ? 0 : undefined,
          border: isUser ? "none" : `1px solid var(--border)`,
        }}
      >
        {!isUser && (
          <div className="flex items-center gap-1 mb-2 pb-2" style={{ borderBottom: `1px solid var(--border)` }}>
            <Sparkles size={14} style={{ color: "#fbbf24" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>ZecoAI</span>
          </div>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>

        <button onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
          style={{ color: "var(--text-tertiary)" }}
          title="Copy message">
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

export default MessageBubble;
