import { FolderOpen, Edit2, Trash2, Share2, Code2 } from "lucide-react";

export default function ProjectCard({ project, onOpen, onEdit, onDelete, onShare }) {
  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  return (
    <div className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
      style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
      {/* Header */}
      <div className="px-6 py-6" style={{ borderBottom: `1px solid ${t.border}`, background: "linear-gradient(to right, var(--accent-light), transparent)" }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--accent-light)" }}>
            <FolderOpen size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold truncate" style={{ color: t.text }}>{project.name}</h3>
            <p className="text-xs mt-1" style={{ color: t.text3 }}>{project.files?.length || 0} files</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center gap-2">
          <Code2 size={14} style={{ color: "var(--accent)" }} />
          <span className="text-sm" style={{ color: t.text2 }}>{project.language || "JavaScript"}</span>
        </div>
        <div className="text-sm space-y-1" style={{ color: t.text3 }}>
          <p>Created: {new Date(project.id).toLocaleDateString()}</p>
          {project.lastModified && <p>Modified: {new Date(project.lastModified).toLocaleDateString()}</p>}
        </div>
        {project.description && <p className="text-sm line-clamp-2" style={{ color: t.text2 }}>{project.description}</p>}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex gap-2" style={{ borderTop: `1px solid ${t.border}` }}>
        <button onClick={() => onOpen?.(project)}
          className="flex-1 text-white text-sm py-2 rounded-lg transition-colors font-medium" style={{ backgroundColor: "var(--accent)" }}>Open</button>
        <button onClick={() => onShare?.(project)} className="p-2 rounded-lg transition-colors"
          style={{ border: `1px solid ${t.border}`, color: t.text3 }} title="Share"><Share2 size={16} /></button>
        <button onClick={() => onEdit?.(project)} className="p-2 rounded-lg transition-colors"
          style={{ border: `1px solid ${t.border}`, color: t.text3 }} title="Edit"><Edit2 size={16} /></button>
        <button onClick={() => onDelete?.(project)} className="p-2 rounded-lg transition-colors"
          style={{ border: `1px solid ${t.border}`, color: t.text3 }} title="Delete"><Trash2 size={16} /></button>
      </div>
    </div>
  );
}
