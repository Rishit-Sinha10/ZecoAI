import { useState, useEffect } from "react";
import { GitBranch, Wifi, WifiOff } from "lucide-react";

export default function StatusBar({ language, editorRef, isSaved, isCompleting }) {
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [selectionInfo, setSelectionInfo] = useState("");
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const editor = editorRef?.current;
    if (!editor) return;

    const updatePosition = () => {
      const pos = editor.getPosition();
      if (pos) {
        setCursorPos({ line: pos.lineNumber, column: pos.column });
      }
      const sel = editor.getSelection();
      if (sel && !sel.isEmpty()) {
        const selected = editor.getModel().getValueInRange(sel);
        const lines = selected.split("\n").length;
        const chars = selected.length;
        setSelectionInfo(`${lines} lines, ${chars} chars`);
      } else {
        setSelectionInfo("");
      }
    };

    updatePosition();
    const disposable = editor.onDidChangeCursorPosition(updatePosition);
    const disposable2 = editor.onDidChangeCursorSelection(updatePosition);

    return () => {
      disposable?.dispose();
      disposable2?.dispose();
    };
  }, [editorRef?.current]);

  const langDisplay = language
    ? language.charAt(0).toUpperCase() + language.slice(1)
    : "Plain Text";

  return (
    <div
      className="h-6 min-h-[24px] shrink-0 px-3 flex items-center justify-between text-[11px] select-none"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        color: "var(--text-tertiary)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: isSaved ? "#10b981" : "#f59e0b" }}
          />
          {isSaved ? "Saved" : "Modified"}
        </span>
        {isCompleting && (
          <span style={{ color: "var(--accent)" }}>AI thinking...</span>
        )}
      </div>

      {/* Center */}
      <div className="flex items-center gap-3">
        <span>Ln {cursorPos.line}, Col {cursorPos.column}</span>
        {selectionInfo && <span>{selectionInfo}</span>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span>{langDisplay}</span>
        <span>UTF-8</span>
        <span>Spaces: 2</span>
        <span className="flex items-center gap-1">
          {online ? <Wifi size={10} /> : <WifiOff size={10} />}
        </span>
      </div>
    </div>
  );
}
