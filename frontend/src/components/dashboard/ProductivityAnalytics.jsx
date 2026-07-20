import { useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Activity, PieChart as PieChartIcon } from "lucide-react"

const COLORS = ["var(--accent)", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border px-3 py-2 text-xs shadow-md" style={{ backgroundColor: "var(--bg-tertiary)", borderColor: "var(--border)", color: "var(--text-primary)" }}>
      <p className="font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
      ))}
    </div>
  )
}

export default function ProductivityAnalytics({ projects = [], chats = [] }) {
  const chartData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const requests = days.map((name) => ({ name, requests: 0, tokens: 0 }))
    const codeTrend = days.map((name) => ({ name, lines: 0 }))

    chats.forEach((chat) => {
      const date = new Date(chat.createdAt || chat.updatedAt || 0)
      if (Number.isNaN(date.getTime())) return
      const dayIndex = (date.getDay() + 6) % 7
      requests[dayIndex].requests += 1
      requests[dayIndex].tokens += Array.isArray(chat.messages) ? chat.messages.length * 25 : 0
    })

    projects.forEach((project) => {
      const date = new Date(project.updatedAt || project.lastModified || 0)
      if (Number.isNaN(date.getTime())) return
      const dayIndex = (date.getDay() + 6) % 7
      codeTrend[dayIndex].lines += Array.isArray(project.files) ? project.files.length * 145 : 0
    })

    const langCounts = {}
    projects.forEach((p) => {
      if (p.language) langCounts[p.language] = (langCounts[p.language] || 0) + 1
    })
    const languages = Object.entries(langCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    return { requests, languages, codeTrend }
  }, [projects, chats])

  if (chartData.languages.length === 0 && chartData.requests.every((entry) => entry.requests === 0) && chartData.codeTrend.every((entry) => entry.lines === 0)) {
    return (
      <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Productivity Analytics</h3>
          </div>
          <p className="text-sm text-center py-6" style={{ color: "var(--text-tertiary)" }}>No activity data yet. Start a chat or create a project to populate analytics.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Productivity Analytics</h3>
        </div>
        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="w-full mb-3 h-8">
            <TabsTrigger value="requests" className="text-xs flex-1">Requests</TabsTrigger>
            <TabsTrigger value="code" className="text-xs flex-1">Code Trend</TabsTrigger>
            <TabsTrigger value="languages" className="text-xs flex-1">Languages</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.requests}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" name="Requests" stroke="var(--accent)" strokeWidth={2} fill="url(#reqGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="code">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.codeTrend}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="lines" name="Lines Generated" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="languages">
            <div className="flex items-center gap-6">
              <div className="w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.languages}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.languages.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {chartData.languages.map((lang, i) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs flex-1" style={{ color: "var(--text-secondary)" }}>{lang.name}</span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{lang.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
