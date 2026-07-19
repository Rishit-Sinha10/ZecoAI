import { useState, useMemo } from "react"
import { Target, CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const defaultGoals = [
  { id: 1, label: "Generate 3 files", target: 3, current: 1 },
  { id: 2, label: "Fix 5 bugs", target: 5, current: 3 },
  { id: 3, label: "Complete Dashboard", target: 1, current: 0 },
]

export default function GoalsWidget({ projects = [], chats = [] }) {
  const goals = useMemo(() => {
    const filesGenerated = projects.reduce((s, p) => s + (Array.isArray(p.files) ? p.files.length : 0), 0)
    const aiRequests = chats.length

    return [
      { id: 1, label: "Generate 3 files", target: 3, current: Math.min(filesGenerated, 3) },
      { id: 2, label: "Fix 5 bugs", target: 5, current: Math.min(Math.floor(aiRequests * 0.3), 5) },
      { id: 3, label: "Complete Dashboard", target: 1, current: 1 },
    ]
  }, [projects, chats])

  const totalCompleted = goals.filter((g) => g.current >= g.target).length
  const overallProgress = Math.round((goals.reduce((s, g) => s + Math.min(g.current / g.target, 1), 0) / goals.length) * 100)

  return (
    <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={16} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Today's Goals</h3>
          </div>
          <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            {totalCompleted}/{goals.length} done
          </span>
        </div>

        <Progress value={overallProgress} className="h-1.5 mb-3" />

        <div className="space-y-2.5">
          {goals.map((goal) => {
            const done = goal.current >= goal.target
            return (
              <div key={goal.id} className="flex items-center gap-2.5 group">
                {done ? (
                  <CheckCircle2 size={16} className="shrink-0 text-green-500" />
                ) : (
                  <Circle size={16} className="shrink-0" style={{ color: "var(--text-tertiary)" }} />
                )}
                <span className="text-sm flex-1" style={{ color: done ? "var(--text-tertiary)" : "var(--text-primary)", textDecoration: done ? "line-through" : "none" }}>
                  {goal.label}
                </span>
                <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                  {goal.current}/{goal.target}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
