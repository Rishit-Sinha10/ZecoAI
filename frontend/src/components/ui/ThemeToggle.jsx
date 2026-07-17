import { Sun, Moon, Monitor } from "lucide-react";
import useTheme from "../../hooks/useTheme";

export default function ThemeToggle({ variant = "button" }) {
  const { mode, setLight, setDark } = useTheme();

  if (variant === "segment") {
    return (
      <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg p-0.5 border border-[var(--border)]">
        <button
          onClick={setDark}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
            mode === "dark"
              ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          }`}
          aria-label="Dark theme"
        >
          <Moon size={13} />
          Dark
        </button>
        <button
          onClick={setLight}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
            mode === "light"
              ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
          }`}
          aria-label="Light theme"
        >
          <Sun size={13} />
          Light
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
      title={`Switch to ${mode === "dark" ? "light" : "dark"} theme`}
      aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} theme`}
    >
      {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
