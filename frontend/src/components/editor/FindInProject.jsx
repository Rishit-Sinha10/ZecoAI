import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, ChevronRight, FileCode } from "lucide-react";

export default function FindInProject({ isOpen, onClose, project, onOpenFile }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIdx(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || !project?.files) {
      setResults([]);
      setSelectedIdx(0);
      return;
    }

    const q = query.toLowerCase();
    const found = [];

    for (const file of project.files) {
      if (!file.content) continue;
      const lines = file.content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(q)) {
          found.push({
            fileName: file.name,
            lineNumber: i + 1,
            lineContent: lines[i].trim(),
          });
          if (found.length >= 200) break;
        }
      }
      if (found.length >= 200) break;
    }

    setResults(found);
    setSelectedIdx(0);
  }, [query, project?.files]);

  const groupedResults = useMemo(() => {
    const groups = {};
    for (const r of results) {
      if (!groups[r.fileName]) groups[r.fileName] = [];
      groups[r.fileName].push(r);
    }
    return groups;
  }, [results]);

  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIdx]) {
      onOpenFile?.(results[selectedIdx].fileName);
      onClose();
    }
  };

  const highlightMatch = (text, q) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>{text.slice(idx, idx + q.length)}</span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  let globalIdx = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <Search size={16} style={{ color: "var(--text-tertiary)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Find in project..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--text-primary)" }}
          />
          {results.length > 0 && (
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              {results.length} result{results.length !== 1 && "s"}
            </span>
          )}
          <button onClick={onClose} className="p-1 rounded transition-colors" style={{ color: "var(--text-tertiary)" }}>
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!query.trim() && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
              Type to search across all files
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
              No results for "{query}"
            </div>
          )}

          {Object.entries(groupedResults).map(([fileName, fileResults]) => (
            <div key={fileName}>
              <div
                className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider sticky top-0"
                style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}
              >
                <FileCode size={12} />
                {fileName}
                <span className="ml-auto">{fileResults.length}</span>
              </div>
              {fileResults.map((r) => {
                const idx = globalIdx++;
                return (
                  <button
                    key={`${r.fileName}:${r.lineNumber}`}
                    onClick={() => { onOpenFile?.(r.fileName); onClose(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-1.5 text-[12px] transition-colors"
                    style={{
                      backgroundColor: idx === selectedIdx ? "var(--accent-light)" : "transparent",
                      color: "var(--text-primary)",
                    }}
                    onMouseEnter={() => setSelectedIdx(idx)}
                  >
                    <span className="w-8 text-right shrink-0 font-mono" style={{ color: "var(--text-tertiary)" }}>
                      {r.lineNumber}
                    </span>
                    <ChevronRight size={10} style={{ color: "var(--text-tertiary)" }} />
                    <span className="truncate font-mono">
                      {highlightMatch(r.lineContent, query)}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
