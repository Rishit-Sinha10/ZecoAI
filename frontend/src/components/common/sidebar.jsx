import { useState } from "react";
import {
  LayoutDashboard,
  FolderCode,
  MessageSquare,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Terminal,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { title: "Projects", icon: FolderCode, to: "/projects" },
  { title: "Chat", icon: MessageSquare, to: "/chat" },
  { title: "Runs", icon: Terminal, to: "/runs" },
  { title: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      style={{
        width: collapsed ? "52px" : "200px",
        transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
      className="relative flex flex-col h-full overflow-hidden shrink-0"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-2 py-3"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {!collapsed && (
          <span
            className="text-[11px] font-semibold tracking-wider uppercase pl-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            Menu
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-0.5">
        {navItems.map(({ title, icon: Icon, to }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? title : undefined}
              className={`
                relative flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-[13px]
                transition-colors duration-100 outline-none
                ${
                  isActive
                    ? "font-medium"
                    : "hover:bg-[var(--bg-tertiary)]"
                }
              `}
              style={{
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: isActive ? "var(--accent-light)" : undefined,
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
              )}
              <Icon
                size={16}
                className="shrink-0"
                style={{ color: isActive ? "var(--accent)" : undefined }}
              />
              {!collapsed && <span className="truncate">{title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-2 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </aside>
  );
}
