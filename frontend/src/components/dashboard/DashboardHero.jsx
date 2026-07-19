import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, FolderCode, MessageSquare, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good Morning"
  if (h < 18) return "Good Afternoon"
  return "Good Evening"
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Never"
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return "Just now"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export default function DashboardHero({ projects = [], chats = [], userName }) {
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const totalFiles = projects.reduce((s, p) => s + (Array.isArray(p.files) ? p.files.length : 0), 0)
    const lastActive = projects.length > 0
      ? projects.reduce((latest, p) => {
          const d = new Date(p.updatedAt || p.lastModified || 0)
          return d > latest ? d : latest
        }, new Date(0))
      : null

    return {
      aiRequests: chats.length,
      projectCount: projects.length,
      fileCount: totalFiles,
      lastActive: formatTimeAgo(lastActive?.toISOString()),
    }
  }, [projects, chats])

  const lastProject = projects.length > 0
    ? [...projects].sort((a, b) => new Date(b.updatedAt || b.lastModified || 0) - new Date(a.updatedAt || a.lastModified || 0))[0]
    : null

  const greeting = getGreeting()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          {greeting}{userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Welcome back to your AI workspace.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles size={12} style={{ color: "var(--accent)" }} />
          {stats.aiRequests} AI Requests Today
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <FolderCode size={12} />
          {stats.projectCount} Projects
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <Zap size={12} />
          {stats.fileCount} Files
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Last Active {stats.lastActive}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        {lastProject ? (
          <Button size="sm" onClick={() => navigate(`/editor/${lastProject._id || lastProject.id}`)}>
            <FolderCode size={14} />
            Continue Last Project
          </Button>
        ) : (
          <Button size="sm" onClick={() => navigate("/projects")}>
            <FolderCode size={14} />
            Create First Project
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => navigate("/chat")}>
          <MessageSquare size={14} />
          New AI Chat
        </Button>
      </div>
    </div>
  )
}
