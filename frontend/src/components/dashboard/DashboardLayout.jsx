import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderCode,
  MessageSquare,
  Settings,
  Plus,
  FileCode,
  Clock,
  ChevronRight,
  Sparkles,
  Code2,
  BarChart3,
} from "lucide-react";
import Navbar from "../common/navbar";
import Sidebar from "../common/sidebar";
import useAuth from "../../hooks/useAuth";
import { getUserProjectsAPI } from "../../services/projectAPI";

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      if (isSignedIn) {
        try {
          const data = await getUserProjectsAPI(getToken);
          setProjects(data);
        } catch {
          setProjects(JSON.parse(localStorage.getItem("projects")) || []);
        }
      } else {
        setProjects(JSON.parse(localStorage.getItem("projects")) || []);
      }
    };
    loadProjects();
  }, [isSignedIn, getToken]);

  const totalFiles = projects.reduce((sum, p) => sum + (p.files?.length || 0), 0);
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt || b.lastModified) - new Date(a.updatedAt || a.lastModified))
    .slice(0, 5);

  const langCounts = {};
  projects.forEach((p) => {
    const lang = p.language || "Unknown";
    langCounts[lang] = (langCounts[lang] || 0) + 1;
  });
  const topLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const quickActions = [
    { label: "New Project", icon: Plus, color: "var(--accent)", action: () => navigate("/projects") },
    { label: "Editor", icon: Code2, color: "#10b981", action: () => navigate("/projects") },
    { label: "AI Chat", icon: MessageSquare, color: "#8b5cf6", action: () => navigate("/chat") },
    { label: "Settings", icon: Settings, color: "#f59e0b", action: () => navigate("/settings") },
  ];

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  const fmtTime = (iso) => {
    if (!iso) return "Never";
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 60_000) return "Just now";
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: t.bg }}>
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold" style={{ color: t.text }}>
                Welcome back
              </h1>
              <p className="mt-1 text-sm" style={{ color: t.text3 }}>
                Here's an overview of your workspace.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Projects", value: projects.length, icon: FolderCode, color: "var(--accent)" },
                { label: "Files", value: totalFiles, icon: FileCode, color: "#10b981" },
                { label: "Languages", value: Object.keys(langCounts).length, icon: BarChart3, color: "#8b5cf6" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-xl p-5 transition-colors"
                  style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                >
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ backgroundColor: `${color}18`, color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: t.text }}>{value}</p>
                    <p className="text-xs" style={{ color: t.text3 }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: t.text3 }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map(({ label, icon: Icon, color, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                  >
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-lg"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: t.text2 }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: t.text3 }}>
                    Recent Projects
                  </h2>
                  {projects.length > 0 && (
                    <button
                      onClick={() => navigate("/projects")}
                      className="text-xs font-medium flex items-center gap-1 transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      View all <ChevronRight size={12} />
                    </button>
                  )}
                </div>
                {recentProjects.length === 0 ? (
                  <div
                    className="rounded-xl p-8 text-center"
                    style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                  >
                    <FolderCode size={32} className="mx-auto mb-3" style={{ color: t.text3, opacity: 0.3 }} />
                    <p className="text-sm mb-3" style={{ color: t.text3 }}>
                      No projects yet. Create one to get started.
                    </p>
                    <button
                      onClick={() => navigate("/projects")}
                      className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      <Plus size={16} /> Create Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentProjects.map((project) => (
                      <button
                        key={project._id || project.id}
                        onClick={() => navigate(`/editor/${project._id || project.id}`)}
                        className="w-full flex items-center gap-4 rounded-xl p-4 transition-all hover:scale-[1.01] text-left"
                        style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                      >
                        <div
                          className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                          style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
                        >
                          <FolderCode size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: t.text }}>
                            {project.name}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: t.text3 }}>
                            {project.files?.length || 0} file{project.files?.length !== 1 ? "s" : ""} · {project.language || "Unknown"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0" style={{ color: t.text3 }}>
                          <Clock size={12} />
                          <span className="text-xs">{fmtTime(project.updatedAt || project.lastModified)}</span>
                        </div>
                        <ChevronRight size={16} style={{ color: t.text3 }} className="shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right column: Languages + AI */}
              <div className="space-y-6">
                {/* Top Languages */}
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: t.text3 }}>
                    Languages Used
                  </h2>
                  <div
                    className="rounded-xl p-4 space-y-3"
                    style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                  >
                    {topLangs.length === 0 ? (
                      <p className="text-sm" style={{ color: t.text3 }}>No data yet.</p>
                    ) : (
                      topLangs.map(([lang, count]) => {
                        const pct = Math.round((count / projects.length) * 100);
                        return (
                          <div key={lang}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium" style={{ color: t.text2 }}>{lang}</span>
                              <span className="text-xs" style={{ color: t.text3 }}>{count} project{count !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: t.bg3 }}>
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* AI Tip */}
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} style={{ color: "var(--accent)" }} />
                    <span className="text-sm font-semibold" style={{ color: t.text }}>AI Tip</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: t.text3 }}>
                    Ask the AI chat to explain any code, generate boilerplate, or debug errors — it knows your project context.
                  </p>
                  <button
                    onClick={() => navigate("/chat")}
                    className="mt-3 text-xs font-medium transition-colors"
                    style={{ color: "var(--accent)" }}
                  >
                    Open AI Chat →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
