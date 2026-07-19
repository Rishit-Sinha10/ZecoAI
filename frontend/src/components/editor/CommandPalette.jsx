import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Terminal, FileCode, Brain, FolderPlus, FilePlus, Play } from "lucide-react";

const COMMANDS = [
  { id: "file-search", label: "Search Files", icon: Search, shortcut: "Ctrl+P", category: "Navigation" },
  { id: "command-palette", label: "Command Palette", icon: Terminal, shortcut: "Ctrl+Shift+P", category: "General" },
  { id: "run-code", label: "Run Code", icon: Play, shortcut: "Ctrl+Enter", category: "Code" },
  { id: "ai-chat", label: "Open AI Chat", icon: Brain, shortcut: "", category: "AI" },
  { id: "find-in-project", label: "Find in Project", icon: Search, shortcut: "Ctrl+Shift+F", category: "Navigation" },
  { id: "add-file", label: "Add File", icon: FilePlus, shortcut: "", category: "File" },
  { id: "add-folder", label: "Add Folder", icon: FolderPlus, shortcut: "", category: "File" },
];

export default function CommandPalette({ isOpen, onClose, onSelect, files = [] }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const isFileSearch = !query.startsWith(">");

  const filteredItems = useMemo(() => {
    const q = query.replace(/^>/, "").toLowerCase().trim();
    if (!q) return isFileSearch ? files.slice(0, 20) : COMMANDS;

    if (isFileSearch) {
      return files.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 20);
    }
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query, isFileSearch, files]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => { setSelectedIndex(0); }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, filteredItems.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); handleSelect(filteredItems[selectedIndex]); }
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, filteredItems, selectedIndex]);

  const handleSelect = (item) => {
    if (!item) return;
    if (isFileSearch) {
      onSelect?.({ type: "file", name: item.name, id: item.id });
    } else {
      onSelect?.({ type: "command", id: item.id });
    }
    onClose();
  };

  if (!isOpen) return null;

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", accent: "var(--accent)",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${t.border}` }}>
          <Search size={16} style={{ color: t.text3 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search files or > for commands..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: t.text }}
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: t.bg3, color: t.text3, border: `1px solid ${t.border}` }}>ESC</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm" style={{ color: t.text3 }}>No results found</div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = isFileSearch ? FileCode : item.icon;
              return (
                <div
                  key={isFileSearch ? item.name : item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors"
                  style={{
                    backgroundColor: index === selectedIndex ? t.bg3 : "transparent",
                    color: t.text,
                  }}
                >
                  <Icon size={14} style={{ color: t.text3, flexShrink: 0 }} />
                  <span className="flex-1 truncate">{isFileSearch ? item.name : item.label}</span>
                  {!isFileSearch && item.shortcut && (
                    <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: t.bg, color: t.text3, border: `1px solid ${t.border}` }}>{item.shortcut}</kbd>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="px-4 py-2 text-[10px] flex gap-4" style={{ borderTop: `1px solid ${t.border}`, color: t.text3 }}>
          <span><kbd className="px-1 rounded" style={{ backgroundColor: t.bg3 }}>&uarr;</kbd><kbd className="px-1 rounded" style={{ backgroundColor: t.bg3 }}>&darr;</kbd> Navigate</span>
          <span><kbd className="px-1 rounded" style={{ backgroundColor: t.bg3 }}>Enter</kbd> Select</span>
          <span><kbd className="px-1 rounded" style={{ backgroundColor: t.bg3 }}>&gt;</kbd> Prefix for commands</span>
        </div>
      </div>
    </div>
  );
}
