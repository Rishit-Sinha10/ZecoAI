import { useState } from "react";
import { FolderOpen, Edit2, Trash2, Share2, Code2 } from "lucide-react";
import ShareModal from "./ShareModal";
import useAuth from "../../hooks/useAuth";

export default function ProjectCard({ project, onOpen, onEdit, onDelete, onShare }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const { isSignedIn, getToken } = useAuth();
  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  const createdDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString()
    : project.id
      ? new Date(Number(project.id)).toLocaleDateString()
      : "Unknown";

  const modifiedDate = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString()
    : project.lastModified
      ? new Date(project.lastModified).toLocaleDateString()
      : null;

  return (
    <>
      <div className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
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

        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center gap-2">
            <Code2 size={14} style={{ color: "var(--accent)" }} />
            <span className="text-sm" style={{ color: t.text2 }}>{project.language || "JavaScript"}</span>
          </div>
          <div className="text-sm space-y-1" style={{ color: t.text3 }}>
            <p>Created: {createdDate}</p>
            {modifiedDate && <p>Modified: {modifiedDate}</p>}
          </div>
          {project.description && <p className="text-sm line-clamp-2" style={{ color: t.text2 }}>{project.description}</p>}
          {project.shareId && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>
              <Share2 size={10} />
              Shared
            </span>
          )}
        </div>

        <div className="px-6 py-4 flex gap-2" style={{ borderTop: `1px solid ${t.border}` }}>
          <button onClick={() => onOpen?.(project)}
            className="flex-1 text-white text-sm py-2 rounded-lg transition-colors font-medium" style={{ backgroundColor: "var(--accent)" }}>Open</button>
          <button onClick={() => setShowShareModal(true)} className="p-2 rounded-lg transition-colors"
            style={{ border: `1px solid ${t.border}`, color: project.shareId ? "var(--accent)" : t.text3 }} title="Share"><Share2 size={16} /></button>
          <button onClick={() => onEdit?.(project)} className="p-2 rounded-lg transition-colors"
            style={{ border: `1px solid ${t.border}`, color: t.text3 }} title="Edit"><Edit2 size={16} /></button>
          <button onClick={() => onDelete?.(project._id || project.id)} className="p-2 rounded-lg transition-colors"
            style={{ border: `1px solid ${t.border}`, color: t.text3 }} title="Delete"><Trash2 size={16} /></button>
        </div>
      </div>

      <ShareModal
        project={project}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        getToken={getToken}
        isSignedIn={isSignedIn}
        onUpdate={(updated) => onShare?.(updated)}
      />
    </>
  );
}
