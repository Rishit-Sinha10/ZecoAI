import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, Play, Terminal, ChevronRight, Code2, Filter } from "lucide-react";
import Navbar from "../components/common/navbar";
import { useToast } from "../context/ToastContext";
import useAuth from "../hooks/useAuth";
import { getUserRunsAPI, deleteRunAPI } from "../services/codeHistoryAPI";

function ExecutionHistory() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [langFilter, setLangFilter] = useState("all");
  const { toast } = useToast();
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (isSignedIn) fetchRuns();
    else { setLoading(false); setError("Sign in to view execution history"); }
  }, [isSignedIn]);

  const fetchRuns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserRunsAPI(getToken);
      setRuns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (runId, e) => {
    e.stopPropagation();
    if (!confirm("Delete this run?")) return;
    try {
      await deleteRunAPI(runId, getToken);
      setRuns((prev) => prev.filter((r) => r._id !== runId));
      toast.success("Run deleted");
    } catch {
      toast.error("Failed to delete run");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const languages = [...new Set(runs.map((r) => r.language))];
  const filteredRuns = langFilter === "all" ? runs : runs.filter((r) => r.language === langFilter);

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", accent: "var(--accent)",
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: t.bg }}>
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-16">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 py-6" style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg3 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: t.text }}>Execution History</h1>
                <p className="text-sm mt-1" style={{ color: t.text3 }}>
                  {runs.length} run{runs.length !== 1 ? "s" : ""}
                </p>
              </div>
              {languages.length > 0 && (
                <div className="flex items-center gap-2">
                  <Filter size={14} style={{ color: t.text3 }} />
                  <select
                    value={langFilter}
                    onChange={(e) => setLangFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg text-sm focus:outline-none"
                    style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}`, color: t.text2 }}
                  >
                    <option value="all">All languages</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm" style={{ color: t.text3 }}>Loading history...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Terminal size={48} className="mb-4" style={{ color: t.text3, opacity: 0.3 }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: t.text }}>{error}</h2>
                {!isSignedIn && (
                  <button onClick={() => navigate("/login")} className="mt-4 px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: "var(--accent)" }}>
                    Sign In
                  </button>
                )}
              </div>
            ) : filteredRuns.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Terminal size={48} className="mb-4" style={{ color: t.text3, opacity: 0.3 }} />
                <h2 className="text-xl font-semibold mb-2" style={{ color: t.text }}>No runs yet</h2>
                <p className="mb-4" style={{ color: t.text3 }}>Execute code in the editor to see your history here.</p>
                <button onClick={() => navigate("/projects")} className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: "var(--accent)" }}>
                  Open Projects
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-w-4xl">
                {filteredRuns.map((run) => {
                  const isExpanded = expandedId === run._id;
                  const hasError = run.error && run.error.trim().length > 0;
                  return (
                    <div
                      key={run._id}
                      className="rounded-lg overflow-hidden transition-all"
                      style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                    >
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : run._id)}
                        className="flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = t.bg3)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                          style={{ backgroundColor: hasError ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)" }}
                        >
                          {hasError
                            ? <Terminal size={14} style={{ color: "#ef4444" }} />
                            : <Play size={14} fill="currentColor" style={{ color: "#10b981" }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: t.text2 }}>{run.language}</span>
                            {run.executionTime && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: t.bg3, color: t.text3 }}>
                                {run.executionTime}s
                              </span>
                            )}
                            {run.exitCode !== null && run.exitCode !== 0 && (
                              <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                                exit {run.exitCode}
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-0.5 truncate" style={{ color: t.text3 }}>
                            {run.code.substring(0, 80)}{run.code.length > 80 ? "..." : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Clock size={12} style={{ color: t.text3 }} />
                          <span className="text-xs" style={{ color: t.text3 }}>{formatDate(run.createdAt)}</span>
                        </div>
                        <button
                          onClick={(e) => handleDelete(run._id, e)}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: t.text3 }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                        <ChevronRight
                          size={14}
                          style={{ color: t.text3, transform: isExpanded ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.2s" }}
                        />
                      </div>

                      {isExpanded && (
                        <div style={{ borderTop: `1px solid ${t.border}` }}>
                          {run.stdin && (
                            <div className="px-4 py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: t.text3 }}>Input</p>
                              <pre className="text-xs font-mono whitespace-pre-wrap" style={{ color: t.text2 }}>{run.stdin}</pre>
                            </div>
                          )}
                          <div className="px-4 py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: t.text3 }}>Code</p>
                            <pre className="text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto" style={{ color: t.text2 }}>{run.code}</pre>
                          </div>
                          <div className="px-4 py-2" style={{ borderBottom: `1px solid ${t.border}` }}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: t.text3 }}>Output</p>
                            <pre className="text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto" style={{ color: hasError ? "#ef4444" : "#10b981" }}>
                              {run.output || run.error || "(no output)"}
                            </pre>
                          </div>
                          <div className="px-4 py-2 flex gap-4">
                            {run.executionTime && <span className="text-[11px]" style={{ color: t.text3 }}>Time: {run.executionTime}s</span>}
                            {run.memory && <span className="text-[11px]" style={{ color: t.text3 }}>Memory: {run.memory} KB</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecutionHistory;
