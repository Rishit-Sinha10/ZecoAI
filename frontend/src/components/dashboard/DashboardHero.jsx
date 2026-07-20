import { useMemo } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Sparkles,
  FolderCode,
  MessageSquare,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LanguageAnalytics from "./LanguageAnalytics"
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
      usageProgress: Math.min(88, Math.round((chats.length * 12 + totalFiles * 3) % 90)),
    }
  }, [projects, chats])
  const lastProject = projects.length > 0
    ? [...projects].sort((a, b) => new Date(b.updatedAt || b.lastModified || 0) - new Date(a.updatedAt || a.lastModified || 0))[0]
    : null

  const greeting = getGreeting()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(109,93,246,0.09),rgba(255,255,255,0.92)_45%,rgba(109,93,246,0.04))] shadow-[0_18px_60px_rgba(17,24,39,0.06)]"
    >
      <div className="grid gap-6 p-6 xl:grid-cols-[1.55fr_0.9fr] xl:p-7">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
                {greeting}{userName ? `, ${userName}` : ""} 
              </h1>
              <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
                Continue where you left off with a calm, focused developer environment built for shipping fast.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs">
              <FolderCode size={12} />
              {stats.projectCount} projects
            </Badge>
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs">
              <Zap size={12} />
              {stats.fileCount} files edited
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Projects", value: `${stats.projectCount}`, accent: "#14b8a6" },
              { label: "Files Edited", value: `${stats.fileCount}`, accent: "#f59e0b" },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">{item.label}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-semibold text-[var(--text-primary)]">{item.value}</span>
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.accent }} />
                </div>
              </div>
            ))}
          </div>
          <LanguageAnalytics projects={projects} />
        </div>
      </div>
    </motion.div>
  )
}
