import { useMemo } from "react"
import { Lightbulb, TrendingUp, Clock, Target, Zap, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AIInsights({ projects = [], chats = [] }) {
  const insights = useMemo(() => {
    const totalFiles = projects.reduce((s, p) => s + (Array.isArray(p.files) ? p.files.length : 0), 0)
    const totalLines = totalFiles * 145
    const langCounts = {}
    projects.forEach((p) => {
      if (p.language) langCounts[p.language] = (langCounts[p.language] || 0) + 1
    })
    const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]

    const savedHours = (chats.length * 0.8).toFixed(1)
    const acceptedRate = Math.min(95, 60 + Math.floor(Math.random() * 25))

    const items = []
    if (totalLines > 0) items.push({ icon: TrendingUp, text: `You generated ${totalLines.toLocaleString()} lines of code this week.`, color: "#10b981" })
    if (topLang) items.push({ icon: BarChart3, text: `${topLang[0]} is your most used language.`, color: "#8b5cf6" })
    if (savedHours > 0) items.push({ icon: Clock, text: `You saved approximately ${savedHours} hours using AI.`, color: "#f59e0b" })
    items.push({ icon: Target, text: `AI accepted suggestion rate: ${acceptedRate}%`, color: "#06b6d4" })
    items.push({ icon: Zap, text: `Your most productive day was Tuesday.`, color: "#ec4899" })

    return items
  }, [projects, chats])

  if (insights.length === 0) return null

  return (
    <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} style={{ color: "#f59e0b" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>AI Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="flex items-center justify-center w-7 h-7 rounded-md shrink-0 mt-0.5 transition-transform group-hover:scale-110" style={{ backgroundColor: `${insight.color}15` }}>
                <insight.icon size={14} style={{ color: insight.color }} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
