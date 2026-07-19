import { useMemo } from "react"
import {
  FolderCode, FileCode, MessageSquare, Bug, Code2,
  LayoutTemplate, Cpu, Clock, TrendingUp, TrendingDown
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
  const points = []
  for (let i = 0; i < 7; i++) {
    points.push({ v: Math.max(0, current * (0.3 + Math.random() * 0.7)) })
  }
  return points
}

export default function StatsGrid({ projects = [], chats = [] }) {
  const stats = useMemo(() => {
    const totalFiles = projects.reduce((s, p) => s + (Array.isArray(p.files) ? p.files.length : 0), 0)
    const langSet = new Set(projects.map((p) => p.language).filter(Boolean))

    return [
      { label: "Projects", value: projects.length, icon: FolderCode, color: "var(--accent)", change: "+2", up: true },
      { label: "Files", value: totalFiles, icon: FileCode, color: "#10b981", change: "+12", up: true },
      { label: "AI Requests", value: chats.length, icon: MessageSquare, color: "#8b5cf6", change: "+5", up: true },
      { label: "Debug Sessions", value: Math.floor(chats.length * 0.3), icon: Bug, color: "#ef4444", change: "+1", up: true },
      { label: "Generated Code", value: `${Math.floor(totalFiles * 14.5)}K`, icon: Code2, color: "#f59e0b", change: "+3.2K", up: true },
      { label: "Templates Used", value: Math.floor(projects.length * 0.4), icon: LayoutTemplate, color: "#06b6d4", change: "0", up: false },
      { label: "Tokens Consumed", value: `${(chats.length * 2.4).toFixed(1)}K`, icon: Cpu, color: "#ec4899", change: "+1.2K", up: true },
      { label: "Avg Response", value: "1.8s", icon: Clock, color: "#14b8a6", change: "-0.3s", up: false },
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
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
                <span className="flex items-center gap-0.5 text-[11px] font-medium" style={{ color: stat.up ? "#10b981" : "var(--text-tertiary)" }}>
                  {stat.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {stat.change}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
