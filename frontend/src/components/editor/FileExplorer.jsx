import { Plus, Trash2, File, Star } from "lucide-react";
import { useState } from "react";

function FileExplorer({
  project,
  activeFileId,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onSetMainFile,
}) {
  const handleFileClick = (fileId) => {
    onSelectFile(fileId);
  };

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
    return map[ext] || "text-zinc-500";
  };

  return (
    <div className="w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col overflow-hidden shrink-0">
      {/* Header */}
      <div className="border-b border-zinc-800 px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Explorer
          </h3>
        </div>

        <button
          onClick={onAddFile}
          className="w-full flex items-center justify-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[12px] py-1.5 px-2.5 rounded-md transition-colors font-medium border border-zinc-700/50"
          aria-label="Create new file"
        >
          <Plus size={14} />
          New File
        </button>
      </div>

      {/* Project name */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[11px] text-zinc-600 font-medium truncate">{project?.name}</p>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {project?.files && project.files.length > 0 ? (
          project.files.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file.id)}
              className={`
                group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer
                transition-all duration-100 ${
                  activeFileId === file.id
                    ? "bg-indigo-500/15"
                    : "hover:bg-white/[0.04]"
                }
              `}
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
                  <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                )}
                <File size={14} className={`shrink-0 ${activeFileId === file.id ? "text-indigo-400" : getFileColor(file.name)}`} />
                <span className={`text-[12px] truncate ${activeFileId === file.id ? "text-zinc-200 font-medium" : "text-zinc-400"}`}>
                  {file.name}
                </span>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                {!file.isMain && (
                  <button
                    onClick={(e) => handleSetMain(e, file.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-amber-500/15 text-amber-400/50 hover:text-amber-400 transition-all"
                    title="Set as main file"
                    aria-label={`Set ${file.name} as main file`}
                  >
                    <Star size={12} />
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(e, file.id)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/15 text-red-400/50 hover:text-red-400 transition-all"
                  title="Delete file"
                  aria-label={`Delete ${file.name}`}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-zinc-600 text-[12px]">No files yet</p>
            <p className="text-zinc-700 text-[11px] mt-1">Click "New File" to start</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-800 px-3 py-2">
        <p className="text-[10px] text-zinc-700">
          {project?.files?.length || 0} file{(project?.files?.length || 0) !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

export default FileExplorer;
