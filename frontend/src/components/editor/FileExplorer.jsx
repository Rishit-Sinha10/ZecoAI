import { Plus, Trash2, File, Star } from "lucide-react";

function FileExplorer({
  project,
  activeFileId,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onSetMainFile,
}) {
  const handleFileClick = (fileId) => onSelectFile(fileId);

  const handleDelete = (e, fileId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this file?")) {
      onDeleteFile(fileId);
    }
  };

  const handleSetMain = (e, fileId) => {
    e.stopPropagation();
    onSetMainFile?.(fileId);
  };

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
      c: "#93c5fd",
      html: "#fdba74",
      css: "#93c5fd",
      json: "#fde047",
      md: "#a1a1aa",
    };
    return map[ext] || "var(--text-tertiary)";
  };

  return (
    <div
      className="w-52 flex flex-col overflow-hidden shrink-0"
      style={{ backgroundColor: "var(--bg-primary)", borderRight: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Explorer
          </h3>
        </div>

        <button
          onClick={onAddFile}
          className="w-full flex items-center justify-center gap-1.5 text-[12px] py-1.5 px-2.5 rounded-md transition-colors font-medium"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          aria-label="Create new file"
        >
          <Plus size={14} />
          New File
        </button>
      </div>

      {/* Project name */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[11px] font-medium truncate" style={{ color: "var(--text-tertiary)" }}>
          {project?.name}
        </p>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {project?.files && project.files.length > 0 ? (
          project.files.map((file) => {
            const isActive = activeFileId === file.id;
            return (
              <div
                key={file.id}
                onClick={() => handleFileClick(file.id)}
                className="group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-all duration-100"
                style={{
                  backgroundColor: isActive ? "var(--accent-light)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleFileClick(file.id);
                  }
                }}
                aria-label={`File: ${file.name}${file.isMain ? " (main)" : ""}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {file.isMain && (
                    <Star size={10} className="fill-amber-400 shrink-0" style={{ color: "#facc15" }} />
                  )}
                  <File
                    size={14}
                    className="shrink-0"
                    style={{ color: isActive ? "var(--accent)" : getFileColor(file.name) }}
                  />
                  <span
                    className="text-[12px] truncate"
                    style={{
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {file.name}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 shrink-0">
                  {!file.isMain && (
                    <button
                      onClick={(e) => handleSetMain(e, file.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all"
                      style={{ color: "var(--text-tertiary)" }}
                      title="Set as main file"
                      aria-label={`Set ${file.name} as main file`}
                    >
                      <Star size={12} />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, file.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all text-red-400/60 hover:text-red-400"
                    title="Delete file"
                    aria-label={`Delete ${file.name}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>No files yet</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Click "New File" to start
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          {project?.files?.length || 0} file{(project?.files?.length || 0) !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

export default FileExplorer;
