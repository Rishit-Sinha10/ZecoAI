import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, File, Folder, FolderOpen, Star, Pencil } from "lucide-react";

function FileExplorer({
  project,
  activeFileId,
  onSelectFile,
  onAddFile,
  onAddFolder,
  onDeleteFile,
  onSetMainFile,
  onRenameFile,
}) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [expandedFolders, setExpandedFolders] = useState({});
  const renameRef = useRef(null);

  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  const getFileIcon = (name, isDir) => {
    if (isDir) return expandedFolders[name] ? FolderOpen : Folder;
    const ext = name?.split(".").pop()?.toLowerCase();
    return File;
  };

  const getFileColor = (name, isDir) => {
    if (isDir) return "#60a5fa";
    const ext = name?.split(".").pop()?.toLowerCase();
    const map = {
      js: "#facc15", jsx: "#22d3ee", ts: "#60a5fa", tsx: "#60a5fa",
      py: "#4ade80", java: "#fb923c", cpp: "#f472b6", c: "#93c5fd",
      html: "#fdba74", css: "#93c5fd", scss: "#f472b6",
      json: "#fde047", md: "#a1a1aa", yaml: "#fde047", yml: "#fde047",
      sh: "#a1a1aa", bash: "#a1a1aa", txt: "#a1a1aa",
      go: "#22d3ee", rs: "#fb923c", rb: "#f472b6", php: "#a78bfa",
    };
    return map[ext] || "var(--text-tertiary)";
  };

  const buildTree = (files) => {
    const tree = { children: {}, files: [] };
    for (const file of files) {
      const path = file.name || "";
      const parts = path.split("/");
      if (parts.length === 1) {
        tree.files.push(file);
      } else {
        let current = tree;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current.children[parts[i]]) {
            current.children[parts[i]] = { children: {}, files: [], path: parts.slice(0, i + 1).join("/") };
          }
          current = current.children[parts[i]];
        }
        current.files.push({ ...file, _displayName: parts[parts.length - 1] });
      }
    }
    return tree;
  };

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleRenameStart = (e, file) => {
    e.stopPropagation();
    const displayName = file._displayName || file.name;
    setRenamingId(file._id || file.id);
    setRenameValue(displayName);
  };

  const handleRenameSubmit = (file) => {
    const newName = renameValue.trim();
    if (!newName || newName === file.name) {
      setRenamingId(null);
      return;
    }

    let finalName = newName;
    if (file.name.includes("/")) {
      const dir = file.name.substring(0, file.name.lastIndexOf("/") + 1);
      finalName = dir + newName;
    }

    onRenameFile?.(file._id || file.id, finalName);
    setRenamingId(null);
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

  const renderFile = (file, depth = 0) => {
    const fid = file._id || file.id;
    const isActive = activeFileId === fid;
    const isRenaming = renamingId === fid;
    const displayName = file._displayName || file.name;

    return (
      <div
        key={fid}
        onClick={() => !isRenaming && handleFileClick(fid)}
        onDoubleClick={(e) => handleRenameStart(e, file)}
        className="group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-all duration-100"
        style={{
          backgroundColor: isActive ? "var(--accent-light)" : "transparent",
          paddingLeft: `${8 + depth * 12}px`,
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
            handleFileClick(fid);
          }
        }}
        aria-label={`File: ${displayName}${file.isMain ? " (main)" : ""}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {file.isMain && (
            <Star size={10} className="fill-amber-400 shrink-0" style={{ color: "#facc15" }} />
          )}
          {(() => {
            const Icon = getFileIcon(displayName, false);
            return (
              <Icon
                size={14}
                className="shrink-0"
                style={{ color: isActive ? "var(--accent)" : getFileColor(displayName) }}
              />
            );
          })()}
          {isRenaming ? (
            <input
              ref={renameRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRenameSubmit(file)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit(file);
                if (e.key === "Escape") setRenamingId(null);
              }}
              className="text-[12px] bg-transparent border rounded px-1 py-0.5 min-w-0 flex-1 focus:outline-none"
              style={{ color: "var(--text-primary)", borderColor: "var(--accent)" }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-[12px] truncate"
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              {displayName}
            </span>
          )}
        </div>

        {!isRenaming && (
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={(e) => handleRenameStart(e, file)}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all"
              style={{ color: "var(--text-tertiary)" }}
              title="Rename"
              aria-label={`Rename ${displayName}`}
            >
              <Pencil size={11} />
            </button>
            {!file.isMain && (
              <button
                onClick={(e) => handleSetMain(e, fid)}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all"
                style={{ color: "var(--text-tertiary)" }}
                title="Set as main file"
                aria-label={`Set ${displayName} as main file`}
              >
                <Star size={12} />
              </button>
            )}
            <button
              onClick={(e) => handleDelete(e, fid)}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all text-red-400/60 hover:text-red-400"
              title="Delete file"
              aria-label={`Delete ${displayName}`}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderFolder = (name, node, depth = 0) => {
    const isExpanded = expandedFolders[name];
    const FolderIcon = isExpanded ? FolderOpen : Folder;

    return (
      <div key={name}>
        <div
          onClick={() => toggleFolder(name)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-all duration-100"
          style={{ paddingLeft: `${8 + depth * 12}px` }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-tertiary)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <FolderIcon size={14} style={{ color: "#60a5fa" }} />
          <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
            {name.split("/").pop()}
          </span>
        </div>
        {isExpanded && (
          <div>
            {Object.entries(node.children).map(([childName, childNode]) =>
              renderFolder(childName, childNode, depth + 1)
            )}
            {node.files.map((file) => renderFile(file, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleFileClick = (fileId) => onSelectFile(fileId);

  const tree = project?.files ? buildTree(project.files) : { children: {}, files: [] };

  return (
    <div
      className="w-52 flex flex-col overflow-hidden shrink-0"
      style={{ backgroundColor: "var(--bg-primary)", borderRight: "1px solid var(--border)" }}
    >
      <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Explorer
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddFile}
            className="flex-1 flex items-center justify-center gap-1.5 text-[12px] py-1.5 px-2.5 rounded-md transition-colors font-medium"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            aria-label="Create new file"
          >
            <Plus size={16} />
            File
          </button>
          <button
            onClick={onAddFolder}
            className="flex-1 flex items-center justify-center gap-1.5 text-[12px] py-1.5 px-2.5 rounded-md transition-colors font-medium"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            aria-label="Create new folder"
          >
            <Folder size={16} />
            Folder
          </button>
        </div>
      </div>

      <div className="px-3 pt-3 pb-1">
        <p className="text-[11px] font-medium truncate" style={{ color: "var(--text-tertiary)" }}>
          {project?.name}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {project?.files && project.files.length > 0 ? (
          <>
            {Object.entries(tree.children).map(([name, node]) =>
              renderFolder(name, node, 0)
            )}
            {tree.files.map((file) => renderFile(file, 0))}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>No files yet</p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
              Click "New File" to start
            </p>
          </div>
        )}
      </div>

      <div className="px-3 py-2" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
          {project?.files?.length || 0} file{(project?.files?.length || 0) !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

export default FileExplorer;
