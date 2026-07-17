import {
  Code2,
  Bell,
  Settings,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith("/editor/");

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)]"
      style={{
        backgroundColor: "var(--bg-primary)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <nav className="flex items-center justify-between px-6 py-3 h-14">
        {/* Left: Logo + Back */}
        <div className="flex items-center gap-3">
          {isEditor && (
            <Link
              to="/projects"
              className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Back to Projects"
            >
              <ArrowLeft size={16} />
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: "var(--accent-light)" }}>
              <Code2 size={18} style={{ color: "var(--accent)" }} />
            </div>
            <span
              className="font-semibold text-sm tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              ZecoAI
            </span>
          </Link>
        </div>

        {/* Center: Nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Projects", to: "/projects" },
            { label: "Chat", to: "/chat" },
            { label: "History", to: "/history" },
          ].map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-[var(--text-primary)] bg-[var(--bg-tertiary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          <div className="w-px h-4 bg-[var(--border)] mx-1" />

          <button
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>
          <button
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Messages"
          >
            <MessageCircle size={16} />
          </button>
          <Link
            to="/settings"
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            aria-label="Settings"
          >
            <Settings size={16} />
          </Link>

          <div className="w-px h-4 bg-[var(--border)] mx-1" />

          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-7 h-7",
              },
            }}
          />
        </div>
      </nav>
    </header>
  );
}
