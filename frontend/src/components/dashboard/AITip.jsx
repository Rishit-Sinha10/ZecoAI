import { useState, useEffect } from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"

const tips = [
  "Try asking AI to optimize this project.",
  "Generate a REST API in one click.",
  "Refactor your components using AI.",
  "Debug errors instantly with AI context.",
  "Generate boilerplate with natural language.",
  "Use AI to write unit tests for your code.",
  "Let AI explain complex code sections.",
  "Create a database schema from a description.",
]

export default function AITip() {
  const [currentTip, setCurrentTip] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md group"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
      onClick={() => navigate("/chat")}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>AI Tip</h3>
        </div>
        <p className="text-sm leading-relaxed transition-opacity duration-300" style={{ color: "var(--text-tertiary)" }}>
          {tips[currentTip]}
        </p>
        <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors group-hover:gap-2" style={{ color: "var(--accent)" }}>
          Open AI Chat <ArrowRight size={12} />
        </span>
      </CardContent>
    </Card>
  )
}
