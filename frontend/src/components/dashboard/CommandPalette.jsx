import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Command } from "cmdk"
import {
  Plus, MessageSquare, Code2, Settings, Bug, FileCode,
  LayoutTemplate, FolderOpen, Search, Terminal, BookOpen
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const commands = [
  { id: "new-project", label: "New Project", icon: Plus, section: "Actions", action: "navigate", path: "/projects", shortcut: "N" },
  { id: "new-chat", label: "New AI Chat", icon: MessageSquare, section: "Actions", action: "navigate", path: "/chat", shortcut: "C" },
  { id: "open-editor", label: "Open Editor", icon: Code2, section: "Actions", action: "navigate", path: "/projects", shortcut: "E" },
  { id: "debug", label: "Debug Code", icon: Bug, section: "Actions", action: "navigate", path: "/chat", shortcut: "D" },
  { id: "generate", label: "Generate Boilerplate", icon: FileCode, section: "Actions", action: "navigate", path: "/chat", shortcut: "G" },
  { id: "templates", label: "Templates", icon: LayoutTemplate, section: "Navigation", action: "navigate", path: "/templates" },
  { id: "projects", label: "All Projects", icon: FolderOpen, section: "Navigation", action: "navigate", path: "/projects" },
  { id: "history", label: "Execution History", icon: Terminal, section: "Navigation", action: "navigate", path: "/runs" },
  { id: "docs", label: "Documentation", icon: BookOpen, section: "Navigation", action: "navigate", path: "/docs" },
  { id: "settings", label: "Settings", icon: Settings, section: "Navigation", action: "navigate", path: "/settings", shortcut: "," },
]

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleSelect = useCallback((cmd) => {
    if (cmd.action === "navigate" && cmd.path) {
      navigate(cmd.path)
      onOpenChange(false)
    }
  }, [navigate, onOpenChange])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(open ? false : true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-lg" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)" }}>
        <Command className="rounded-lg" shouldFilter={true}>
          <div className="flex items-center border-b px-3" style={{ borderColor: "var(--border)" }}>
            <Search size={16} style={{ color: "var(--text-tertiary)" }} className="shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command..."
              className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-[var(--text-tertiary)]"
              style={{ color: "var(--text-primary)" }}
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 text-[10px] font-medium" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
              No results found.
            </Command.Empty>
            {["Actions", "Navigation"].map((section) => {
              const items = commands.filter((c) => c.section === section)
              if (items.length === 0) return null
              return (
                <Command.Group key={section} heading={section} className="mb-2">
                  {items.map((cmd) => (
                    <Command.Item
                      key={cmd.id}
                      value={cmd.label}
                      onSelect={() => handleSelect(cmd)}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors data-[selected=true]:bg-[var(--bg-tertiary)]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <cmd.icon size={16} style={{ color: "var(--text-tertiary)" }} />
                      <span className="flex-1">{cmd.label}</span>
                      {cmd.shortcut && (
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 text-[10px] font-medium" style={{ borderColor: "var(--border)", color: "var(--text-tertiary)" }}>
                          {cmd.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              )
            })}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
