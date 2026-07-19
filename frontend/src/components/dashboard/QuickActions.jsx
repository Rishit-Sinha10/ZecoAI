import { useNavigate } from "react-router-dom"
import {
  Plus, Sparkles, Bug, FileCode, FolderCode,
  LayoutTemplate, ArrowRight, Code2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const actions = [
  { label: "New Project", icon: Plus, desc: "Start building something new", color: "var(--accent)", path: "/projects" },
  { label: "AI Pair Programmer", icon: Sparkles, desc: "Get real-time code assistance", color: "#8b5cf6", path: "/chat" },
  { label: "Debug Code", icon: Bug, desc: "Find and fix errors fast", color: "#ef4444", path: "/chat" },
  { label: "Generate Boilerplate", icon: FileCode, desc: "Scaffold entire projects", color: "#f59e0b", path: "/chat" },
  { label: "Create API", icon: FolderCode, desc: "Build REST APIs in seconds", color: "#06b6d4", path: "/chat" },
  { label: "Open Editor", icon: Code2, desc: "Start coding with AI", color: "#10b981", path: "/projects" },
  { label: "Templates", icon: LayoutTemplate, desc: "Browse starter templates", color: "#ec4899", path: "/templates" },
  { label: "Refactor Code", icon: ArrowRight, desc: "Improve code quality", color: "#14b8a6", path: "/chat" },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.map(({ label, icon: Icon, desc, color, path }) => (
          <Card
            key={label}
            className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
            onClick={() => navigate(path)}
          >
            <CardContent className="p-3.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg mb-2 transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
              <p className="text-[11px] mt-0.5 leading-tight" style={{ color: "var(--text-tertiary)" }}>{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
