import { useState, useEffect } from "react"
import { Bell, Check, Sparkles, FolderCode, LayoutTemplate, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const mockNotifications = [
  { id: 1, icon: Sparkles, text: "AI generation completed", time: "2m ago", read: false, color: "var(--accent)" },
  { id: 2, icon: FolderCode, text: "Project synced successfully", time: "15m ago", read: false, color: "#10b981" },
  { id: 3, icon: LayoutTemplate, text: "New template available", time: "1h ago", read: true, color: "#8b5cf6" },
  { id: 4, icon: Cpu, text: "Model switched to Groq", time: "3h ago", read: true, color: "#f59e0b" },
]

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unread = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell size={16} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-medium flex items-center justify-center text-white" style={{ backgroundColor: "#ef4444" }}>
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</h4>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={markAllRead}>
              <Check size={12} /> Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell size={24} className="mx-auto mb-2" style={{ color: "var(--text-tertiary)", opacity: 0.3 }} />
              <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>No notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-tertiary)]"
                style={!n.read ? { backgroundColor: "var(--bg-tertiary)" } : undefined}
              >
                <div className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 mt-0.5" style={{ backgroundColor: `${n.color}15` }}>
                  <n.icon size={14} style={{ color: n.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>{n.text}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{n.time}</p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: "var(--accent)" }} />}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
