import { useMemo } from "react"
import {
  Code2, Bug, FileCode, Database, Shield, Wrench,
  Sparkles, GitBranch, Palette
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const actionIcons = {
  generate: Code2,
  debug: Bug,
  create: FileCode,
  schema: Database,
  auth: Shield,
  refactor: Wrench,
  default: Sparkles,
}

function getActionType(title) {
  const lower = (title || "").toLowerCase()
  if (lower.includes("generat")) return "generate"
  if (lower.includes("fix") || lower.includes("debug") || lower.includes("error")) return "debug"
  if (lower.includes("creat")) return "create"
  if (lower.includes("schema") || lower.includes("database") || lower.includes("prisma")) return "schema"
  if (lower.includes("auth") || lower.includes("login") || lower.includes("jwt")) return "auth"
  if (lower.includes("refactor") || lower.includes("optim")) return "refactor"
  return "default"
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return "Just now"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export default function ActivityTimeline({ chats = [], projects = [] }) {
  const activities = useMemo(() => {
    const items = []
    chats.slice(0, 10).forEach((chat) => {
      const title = chat.title || chat.messages?.[0]?.content?.substring(0, 40) || "Chat"
      const actionType = getActionType(title)
      items.push({
        id: chat._id || chat.id,
        title: title.substring(0, 50),
        type: actionType,
        timestamp: chat.updatedAt || chat.createdAt,
        project: null,
      })
    })
    projects.slice(0, 5).forEach((p) => {
      items.push({
        id: `proj-${p._id || p.id}`,
        title: `Updated ${p.name}`,
        type: "create",
        timestamp: p.updatedAt || p.lastModified,
        project: p.name,
      })
    })
    items.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
    return items.slice(0, 8)
  }, [chats, projects])

  if (activities.length === 0) {
    return (
      <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch size={16} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Recent Activity</h3>
          </div>
          <p className="text-sm py-4 text-center" style={{ color: "var(--text-tertiary)" }}>
            No activity yet. Start coding to see your activity here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={16} style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Recent Activity</h3>
        </div>
        <div className="space-y-0">
          {activities.map((activity, i) => {
            const Icon = actionIcons[activity.type] || actionIcons.default
            return (
              <div key={activity.id || i} className="flex items-start gap-3 py-2.5 group">
                <div className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 mt-0.5 transition-transform group-hover:scale-110" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                  <Icon size={14} style={{ color: "var(--accent)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>
                    {activity.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {activity.project && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
                        {activity.project}
                      </span>
                    )}
                    <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-green-500 text-[11px] shrink-0 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Done
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
