import { X, FileCode } from "lucide-react";

function FileTabs({ files, activeFileId, onSelectFile, onCloseFile, unsavedFiles }) {
  if (!files || files.length === 0) return null;

  const getFileColor = (name) => {
    const ext = name?.split(".").pop()?.toLowerCase();
    const map = {
      js: "#facc15",
      jsx: "#22d3ee",
      ts: "#60a5fa",
      tsx: "#60a5fa",
      py: "#4ade80",
      java: "#fb923c",
      cpp: "#f472b6",
      html: "#fdba74",
      css: "#93c5fd",
      json: "#fde047",
      md: "#a1a1aa",
    };
    return map[ext] || "var(--text-tertiary)";
  };

  return (
    <div
      className="flex items-stretch overflow-x-auto shrink-0"
      style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
    >
      {files.map((file) => {
        const isActive = activeFileId === file.id;
        const isUnsaved = unsavedFiles?.includes(file.id);

        return (
          <div
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            className="group relative flex items-center gap-2 px-3 h-9 cursor-pointer transition-colors duration-100"
            style={{
              backgroundColor: isActive ? "var(--bg-primary)" : "transparent",
              borderRight: "1px solid var(--border)",
              color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
            }}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectFile(file.id);
              }
            }}
          >
            {isActive && (
              <span
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: "var(--accent)" }}
              />
            )}

            <FileCode size={13} className="shrink-0" style={{ color: getFileColor(file.name) }} />

            <span className="text-[12px] font-medium truncate max-w-[120px]">{file.name}</span>

            {isUnsaved && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseFile(file.id);
              }}
              className="p-0.5 rounded transition-all opacity-0 group-hover:opacity-100"
              style={{
                color: "var(--text-tertiary)",
              }}
              title={`Close ${file.name}`}
              aria-label={`Close ${file.name}`}
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default FileTabs;
