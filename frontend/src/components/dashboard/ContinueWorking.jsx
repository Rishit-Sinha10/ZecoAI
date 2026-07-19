import { useNavigate } from "react-router-dom"
import {
  FolderCode, Clock, MessageSquare, FileCode,
  GitBranch, ArrowRight, Sparkles
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
    .slice(0, 5)

  if (recent.length === 0) {
    return (
      <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
        <CardContent className="p-6 text-center">
          <FolderCode size={32} className="mx-auto mb-3" style={{ color: "var(--text-tertiary)", opacity: 0.3 }} />
          <p className="text-sm mb-3" style={{ color: "var(--text-tertiary)" }}>
            No projects yet. Create one to get started.
          </p>
          <Button size="sm" onClick={() => navigate("/projects")}>
            <FolderCode size={14} /> Create Project
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
          Continue Working
        </h3>
        {projects.length > 5 && (
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => navigate("/projects")}>
            View all <ArrowRight size={12} />
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {recent.map((project) => {
          const pid = project._id || project.id
          const fileCount = Array.isArray(project.files) ? project.files.length : 0
          const lang = project.language || "Unknown"
          const langColor = langColors[lang] || "var(--accent)"

          return (
            <Card
              key={pid}
              className="group cursor-pointer transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
              onClick={() => navigate(`/editor/${pid}`)}
            >
              <CardContent className="p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-transform group-hover:scale-105" style={{ backgroundColor: `${langColor}18` }}>
                    <FolderCode size={18} style={{ color: langColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {project.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        <FileCode size={10} /> {fileCount} file{fileCount !== 1 ? "s" : ""}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        {lang}
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        <MessageSquare size={10} /> {Math.floor(Math.random() * 5)} AI chats
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      <Clock size={10} /> {formatTimeAgo(project.updatedAt || project.lastModified)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6" onClick={(e) => { e.stopPropagation(); navigate(`/chat`) }}>
                        <Sparkles size={12} style={{ color: "var(--accent)" }} />
                      </Button>
                    </div>
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
