import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileCode, Sparkles, BarChart3 } from "lucide-react"

const langColors = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  Java: "#ed8b00",
  "C++": "#00599c",
  HTML: "#e34f26",
  CSS: "#1572b6",
  Go: "#00add8",
  Rust: "#dea584",
  Ruby: "#cc342d",
}

export default function LanguageAnalytics({ projects = [] }) {
  const langData = useMemo(() => {
    const counts = {}
    const lines = {}
    projects.forEach((p) => {
      const lang = p.language || "Unknown"
      counts[lang] = (counts[lang] || 0) + 1
      lines[lang] = (lines[lang] || 0) + (Array.isArray(p.files) ? p.files.length * 145 : 145)
    })

    const totalProjects = projects.length || 1
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / totalProjects) * 100),
        lines: lines[name] || 0,
        color: langColors[name] || "var(--accent)",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)
  }, [projects])

  if (langData.length === 0) {
    return (
      <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={16} style={{ color: "var(--accent)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Language Analytics</h3>
          </div>
          <p className="text-sm py-4 text-center" style={{ color: "var(--text-tertiary)" }}>
            No language data yet. Create a project to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Language Analytics</h3>
        </div>
        <div className="space-y-3">
          {langData.map((lang) => (
            <div key={lang.name} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{lang.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  <span className="flex items-center gap-1"><FileCode size={10} />{lang.count} files</span>
                  <span>{lang.lines.toLocaleString()} lines</span>
                  <span className="flex items-center gap-1"><Sparkles size={10} />{lang.aiUsage} AI</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
