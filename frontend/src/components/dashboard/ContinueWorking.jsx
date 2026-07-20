import { useNavigate } from "react-router-dom"
import {
  FolderCode,
  Clock,
  FileCode,
  GitBranch,
  ArrowRight,
  Sparkles,
  Share2,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

function formatTimeAgo(iso) {
  if (!iso) return "Never"
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return "Just now"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

const langColors = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  Java: "#ed8b00",
  "C++": "#00599c",
  HTML: "#e34f26",
  CSS: "#1572b6",
  Go: "#00add8",
  Rust: "#dea584",
  Ruby: "#cc342d",
}

export default function ContinueWorking({ projects = [] }) {
  const navigate = useNavigate()

  const recent = [...projects]
    .sort((a, b) => new Date(b.updatedAt || b.lastModified || 0) - new Date(a.updatedAt || a.lastModified || 0))
    .slice(0, 4)

  if (recent.length === 0) {
    return (
      <Card className="rounded-[24px] border border-[var(--border)] bg-white shadow-sm">
        <CardContent className="p-6 text-center">
          <FolderCode size={32} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-30" />
          <p className="mb-3 text-sm text-[var(--text-tertiary)]">No projects yet. Create one to get started.</p>
          <Button size="sm" onClick={() => navigate("/projects")}>
            <FolderCode size={14} /> Create Project
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">Continue working</p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">Focused project lanes</h3>
        </div>
        {projects.length > 4 && (
          <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => navigate("/projects")}>
            View all <ArrowRight size={12} />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {recent.map((project) => {
          const pid = project._id || project.id
          const fileCount = Array.isArray(project.files) ? project.files.length : 0
          const lang = project.language || "Unknown"
          const langColor = langColors[lang] || "var(--accent)"
          const progress = Math.min(96, Math.max(34, fileCount * 7 + (project.aiUsage || 0)))

          return (
            <Card
              key={pid}
              className="group cursor-pointer rounded-[20px] border border-[var(--border)] bg-white shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(109,93,246,0.12)]"
              onClick={() => navigate(`/editor/${pid}`)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-[16px] shadow-sm"
                      style={{ backgroundColor: `${langColor}18` }}
                    >
                      <FolderCode size={18} style={{ color: langColor }} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{project.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-tertiary)]">
                        <span className="flex items-center gap-1"><GitBranch size={10} /> {project.branch || "main"}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {formatTimeAgo(project.updatedAt || project.lastModified)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[14px] bg-[var(--bg-tertiary)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Framework</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-2 text-[10px]">{lang}</Badge>
                      </div>
                    </div>
                    <div className="rounded-[14px] bg-[var(--bg-tertiary)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Collaborators</p>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                        <Users size={12} /> 3 active
                      </div>
                    </div>
                    <div className="rounded-[14px] bg-[var(--bg-tertiary)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">AI Usage</p>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                        <Sparkles size={12} className="text-[var(--accent)]" /> {Math.max(12, fileCount * 5)}k tokens
                      </div>
                    </div>
                    <div className="rounded-[14px] bg-[var(--bg-tertiary)] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Deploy</p>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> production ready
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-[var(--text-tertiary)]">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6D5DF6, #8b5cf6)" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/editor/${pid}`) }}>
                      Open
                    </Button>
                    <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/chat`) }}>
                      Continue
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                      <Share2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
