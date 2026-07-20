import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Sparkles,
  Bug,
  FileCode,
  FolderCode,
  LayoutTemplate,
  ArrowRight,
  Code2,
} from "lucide-react"

const actions = [
  { label: "New Project", icon: Plus, desc: "Start building something new",path: "/projects" },
  { label: "Open Editor", icon: Code2, desc: "Jump into your active workspace",path: "/projects" },
  { label: "AI Chat", icon: Sparkles, desc: "Ask for implementation help instantly",path: "/chat" },
  { label: "Generate App", icon: FileCode, desc: "Scaffold the next product fast",path: "/chat" },
  { label: "Debug Code", icon: Bug, desc: "Surface failures and patch them",path: "/chat" },
  { label: "Refactor Code", icon: ArrowRight, desc: "Clean up structure and naming",path: "/chat" },
  { label: "Generate API", icon: FolderCode, desc: "Build endpoints with context",path: "/chat" },
  { label: "Templates", icon: LayoutTemplate, desc: "Browse premium starter patterns",path: "/templates" },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">Quick actions</p>
          <h3 className="mt-1 text-lg font-semibold text-[var(--text-primary)]">Jump into your next move</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map(({ label, icon: Icon, desc, shortcut, color, path }) => (
          <motion.button
            key={label}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.18 }}
            onClick={() => navigate(path)}
            className="group relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-white p-4 text-left shadow-[0_10px_30px_rgba(17,24,39,0.05)] transition-all duration-200 hover:shadow-[0_20px_45px_rgba(109,93,246,0.12)]"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 rounded-t-[20px]"
              style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
            />
            <div className="flex items-start justify-between gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[14px] shadow-sm"
                style={{ background: `linear-gradient(135deg, ${color}1f, ${color}33)` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
                <ArrowRight size={14} className="text-[var(--text-tertiary)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </div>
              <p className="text-xs leading-5 text-[var(--text-secondary)]">{desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
