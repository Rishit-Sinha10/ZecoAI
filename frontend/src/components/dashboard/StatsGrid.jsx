import { useMemo } from "react"
import {
  FolderCode, FileCode, MessageSquare, Bug, Code2,
  LayoutTemplate, Cpu
} from "lucide-react"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

function MiniSparkline({ data, color }) {
  return (
    <div className="w-16 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${color.replace("#", "")})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function generateSparkData(current) {
  const base = Math.max(0, Number(current) || 0)
  return [
    { v: Math.max(0, base * 0.55) },
    { v: Math.max(0, base * 0.72) },
    { v: Math.max(0, base * 0.68) },
    { v: Math.max(0, base * 0.84) },
    { v: Math.max(0, base * 0.78) },
    { v: Math.max(0, base * 0.9) },
    { v: base },
  ]
}

export default function StatsGrid({ projects = [], chats = [] }) {
  const stats = useMemo(() => {
    const totalFiles = projects.reduce((s, p) => s + (Array.isArray(p.files) ? p.files.length : 0), 0)
    const totalMessages = chats.reduce((s, chat) => s + (Array.isArray(chat.messages) ? chat.messages.length : 0), 0)
    const activeLanguages = new Set(projects.map((p) => p.language).filter(Boolean)).size

    return [
      { label: "Projects", value: projects.length, icon: FolderCode, color: "var(--accent)" },
      { label: "Files", value: totalFiles, icon: FileCode, color: "#10b981" },
      { label: "AI Requests", value: chats.length, icon: MessageSquare, color: "#8b5cf6" },
      { label: "Debug Sessions", value: Math.max(0, Math.round(totalMessages * 0.16)), icon: Bug, color: "#ef4444" },
      { label: "Generated Code", value: `${Math.floor(totalFiles * 14.5)}K`, icon: Code2, color: "#f59e0b" },
      { label: "Templates Used", value: Math.max(0, Math.round(projects.length * 0.4)), icon: LayoutTemplate, color: "#06b6d4" },
      { label: "Tokens Consumed", value: `${(totalMessages * 2.4).toFixed(1)}K`, icon: Cpu, color: "#ec4899" },
      { label: "Active Languages", value: activeLanguages, icon: FolderCode, color: "#14b8a6" },
    ]
  }, [projects, chats])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="group cursor-default transition-all duration-200 hover:shadow-md"
          style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <MiniSparkline data={generateSparkData(typeof stat.value === "number" ? stat.value : 10)} color={stat.color} />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
