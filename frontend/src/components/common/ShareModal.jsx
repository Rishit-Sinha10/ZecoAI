import { useState, useEffect } from "react";
import { Link, Copy, Check, Trash2, Loader2 } from "lucide-react";
import { shareProjectAPI, unshareProjectAPI } from "../../services/projectAPI";

export default function ShareModal({ project, isOpen, onClose, getToken, isSignedIn, onUpdate }) {
  const [shareId, setShareId] = useState(project?.shareId || null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setShareId(project?.shareId || null);
    setCopied(false);
  }, [project]);

  if (!isOpen) return null;

  const baseUrl = window.location.origin;
  const shareUrl = shareId ? `${baseUrl}/share/${shareId}` : null;

  const handleShare = async () => {
    if (!isSignedIn || !getToken) return;
    setLoading(true);
    try {
      const result = await shareProjectAPI(project._id, getToken);
      setShareId(result.shareId);
      onUpdate?.({ ...project, shareId: result.shareId });
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!isSignedIn || !getToken) return;
    setLoading(true);
    try {
      await unshareProjectAPI(project._id, getToken);
      setShareId(null);
      onUpdate?.({ ...project, shareId: null });
    } catch (err) {
      console.error("Revoke failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-xl p-6 w-[440px] shadow-2xl" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--accent-light)" }}>
            <Link size={18} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Share Project</h2>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{project?.name}</p>
          </div>
        </div>

        {shareId ? (
          <div className="space-y-4">
            <div className="rounded-lg p-3" style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
              <p className="text-[11px] font-medium mb-2 uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>Public Link</p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 text-[13px] font-mono px-3 py-2 rounded-md focus:outline-none"
                  style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                />
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md transition-colors shrink-0"
                  style={{ backgroundColor: copied ? "#10b981" : "var(--accent)", color: "#fff" }}
                  title="Copy link"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              {copied && (
                <p className="text-[11px] mt-1.5 font-medium" style={{ color: "#10b981" }}>Copied to clipboard!</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-[13px]"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Copy size={14} />
                Copy Link
              </button>
              <button
                onClick={handleRevoke}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-[13px]"
                style={{ backgroundColor: "var(--bg-tertiary)", border: "1px solid var(--border)", color: "#ef4444" }}
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Revoke
              </button>
            </div>

            <p className="text-[11px] text-center" style={{ color: "var(--text-tertiary)" }}>
              Anyone with this link can view the project in read-only mode.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
              Generate a public link so anyone can view this project in read-only mode.
            </p>
            <button
              onClick={handleShare}
              disabled={loading || !isSignedIn}
              className="w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-[13px] disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Link size={14} />}
              Generate Share Link
            </button>
            {!isSignedIn && (
              <p className="text-[11px] text-center" style={{ color: "var(--text-tertiary)" }}>
                Sign in to share projects.
              </p>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 rounded-lg transition-colors text-[13px] font-medium"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
