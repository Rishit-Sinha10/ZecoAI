import { X, FileCode } from "lucide-react";

function FileTabs({ files, activeFileId, onSelectFile, onCloseFile, unsavedFiles }) {
  if (!files || files.length === 0) return null;

  const getFileIcon = (name) => {
    const ext = name?.split(".").pop()?.toLowerCase();
    const colorMap = {
      js: "text-yellow-400",
      jsx: "text-cyan-400",
      ts: "text-blue-400",
      tsx: "text-blue-400",
      py: "text-green-400",
      java: "text-orange-400",
      cpp: "text-pink-400",
      c: "text-blue-300",
      html: "text-orange-300",
      css: "text-blue-300",
      json: "text-yellow-300",
      md: "text-zinc-400",
    };
    return colorMap[ext] || "text-zinc-500";
  };

  return (
    <div className="flex items-center bg-zinc-950 border-b border-zinc-800 overflow-x-auto scrollbar-none shrink-0">
      <div className="flex items-stretch">
        {files.map((file) => {
          const isActive = activeFileId === file.id;
          const isUnsaved = unsavedFiles?.includes(file.id);

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`
                group relative flex items-center gap-2 px-3 py-0 h-9 cursor-pointer
                transition-colors duration-100 border-r border-zinc-800/50
                ${isActive
                  ? "bg-zinc-900 text-zinc-200"
                  : "bg-zinc-950 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                }
              `}
              role="tab"
              aria-selected={isActive}
              aria-label={`File: ${file.name}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectFile(file.id);
                }
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500" />
              )}

              <FileCode size={13} className={`shrink-0 ${isActive ? "text-indigo-400" : getFileIcon(file.name)}`} />

              <span className="text-[12px] font-medium truncate max-w-[120px]">
                {file.name}
              </span>

              {/* Modified dot */}
              {isUnsaved && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseFile(file.id);
                }}
                className={`
                  p-0.5 rounded hover:bg-zinc-700/60 transition-all shrink-0
                  ${isActive ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100"}
                `}
                title={`Close ${file.name}`}
                aria-label={`Close ${file.name}`}
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FileTabs;
