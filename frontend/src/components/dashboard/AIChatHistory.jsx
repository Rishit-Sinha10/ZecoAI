import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { MessageSquare, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function formatTimeAgo(iso) {
  if (!iso) return ""
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60000) return "Just now"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export default function AIChatHistory({ chats = [] }) {
  const navigate = useNavigate()

  const recent = useMemo(() => {
    return [...chats]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
      .slice(0, 6)
  }, [chats])

  return (
    <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>AI Chat History</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => navigate("/chat")}>
            View all <ArrowRight size={11} />
          </Button>
        </div>

        {recent.length === 0 ? (
          <div className="py-6 text-center">
            <MessageSquare size={24} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)", opacity: 0.3 }} />
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>No conversations yet.</p>
            <Button variant="ghost" size="sm" className="text-xs mt-2" onClick={() => navigate("/chat")}>
              Start a Chat
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {recent.map((chat) => {
              const title = chat.title || "New Chat"
              return (
                <button
                  key={chat._id || chat.id}
                  onClick={() => navigate("/chat")}
                  className="w-full flex items-center gap-3 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[var(--bg-tertiary)] group"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md shrink-0" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                    <MessageSquare size={12} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{title}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] shrink-0" style={{ color: "var(--text-tertiary)" }}>
                    <Clock size={10} />
                    {formatTimeAgo(chat.updatedAt || chat.createdAt)}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
