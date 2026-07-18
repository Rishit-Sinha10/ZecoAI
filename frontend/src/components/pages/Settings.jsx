import { useState, useEffect } from "react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { Settings as SettingsIcon, Keyboard, User, Palette, Type, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/navbar";
import ThemeToggle from "../ui/ThemeToggle";
import ColorPicker from "../ui/ColorPicker";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../hooks/useAuth";

const DEFAULT_PREFS = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  formatOnPaste: true,
  smoothCursor: true,
  bracketColorization: true,
};

const SHORTCUTS = [
  { keys: "Ctrl + Enter", action: "Run code" },
  { keys: "Ctrl + S", action: "Save file" },
  { keys: "Ctrl + Shift + F", action: "Find in project" },
  { keys: "Ctrl + /", action: "Toggle comment" },
  { keys: "Ctrl + Z", action: "Undo" },
  { keys: "Ctrl + Shift + Z", action: "Redo" },
  { keys: "Tab", action: "Accept AI suggestion" },
  { keys: "Esc", action: "Reject suggestion / Close panel" },
  { keys: "Shift + Enter", action: "New line in chat" },
];

function Settings() {
  const { isLoaded, userId } = useClerkAuth();
  const { logout, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [prefs, setPrefs] = useState(() => {
    try {
      return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem("editor-prefs") || "{}") };
    } catch { return DEFAULT_PREFS; }
  });

  useEffect(() => {
    localStorage.setItem("editor-prefs", JSON.stringify(prefs));
  }, [prefs]);

  const updatePref = (key, value) => setPrefs((p) => ({ ...p, [key]: value }));

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: t.bg }}>
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-16">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-10 space-y-10">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: t.text }}>
                <SettingsIcon size={24} style={{ color: t.text3 }} /> Settings
              </h1>
              <p className="text-sm mt-1" style={{ color: t.text3 }}>Customize your editor experience</p>
            </div>

            {/* Appearance */}
            <Section title="Appearance" icon={<Palette size={18} />}>
              <div className="space-y-4">
                <SettingRow label="Theme">
                  <ThemeToggle variant="segment" />
                </SettingRow>
                <SettingRow label="Accent Color">
                  <ColorPicker />
                </SettingRow>
              </div>
            </Section>

            {/* Editor */}
            <Section title="Editor" icon={<Type size={18} />}>
              <div className="space-y-4">
                <SettingRow label="Font Size">
                  <div className="flex items-center gap-3">
                    <input type="range" min="10" max="24" value={prefs.fontSize}
                      onChange={(e) => updatePref("fontSize", Number(e.target.value))}
                      className="w-32 accent-[var(--accent)]" />
                    <span className="text-sm font-mono w-8 text-center" style={{ color: t.text2 }}>{prefs.fontSize}px</span>
                  </div>
                </SettingRow>
                <SettingRow label="Tab Size">
                  <select value={prefs.tabSize} onChange={(e) => updatePref("tabSize", Number(e.target.value))}
                    className="px-3 py-1.5 rounded-md text-sm focus:outline-none"
                    style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text }}>
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>8 spaces</option>
                  </select>
                </SettingRow>
                <SettingRow label="Word Wrap">
                  <ToggleSwitch checked={prefs.wordWrap} onChange={(v) => updatePref("wordWrap", v)} />
                </SettingRow>
                <SettingRow label="Minimap">
                  <ToggleSwitch checked={prefs.minimap} onChange={(v) => updatePref("minimap", v)} />
                </SettingRow>
                <SettingRow label="Format on Paste">
                  <ToggleSwitch checked={prefs.formatOnPaste} onChange={(v) => updatePref("formatOnPaste", v)} />
                </SettingRow>
                <SettingRow label="Smooth Cursor Animation">
                  <ToggleSwitch checked={prefs.smoothCursor} onChange={(v) => updatePref("smoothCursor", v)} />
                </SettingRow>
                <SettingRow label="Bracket Colorization">
                  <ToggleSwitch checked={prefs.bracketColorization} onChange={(v) => updatePref("bracketColorization", v)} />
                </SettingRow>
              </div>
            </Section>

            {/* Keyboard Shortcuts */}
            <Section title="Keyboard Shortcuts" icon={<Keyboard size={18} />}>
              <div className="space-y-2">
                {SHORTCUTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < SHORTCUTS.length - 1 ? `1px solid ${t.border}` : "none" }}>
                    <span className="text-sm" style={{ color: t.text2 }}>{s.action}</span>
                    <kbd className="px-2 py-1 rounded text-xs font-mono" style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text3 }}>{s.keys}</kbd>
                  </div>
                ))}
              </div>
            </Section>

            {/* Account */}
            <Section title="Account" icon={<User size={18} />}>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm" style={{ color: t.text2 }}>Status</span>
                  <span className="text-sm font-medium" style={{ color: isLoaded && userId ? "#10b981" : t.text3 }}>
                    {isLoaded && userId ? "Signed in" : "Not signed in"}
                  </span>
                </div>
                {userId && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm" style={{ color: t.text2 }}>User ID</span>
                    <span className="text-xs font-mono" style={{ color: t.text3 }}>{userId}</span>
                  </div>
                )}
                {isSignedIn && (
                  <div className="pt-2" style={{ borderTop: `1px solid ${t.border}` }}>
                    <button
                      onClick={async () => {
                        await logout();
                        navigate("/");
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium text-[13px]"
                      style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  const t = {
    bg2: "var(--bg-secondary)", border: "var(--border)", text: "var(--text-primary)", text3: "var(--text-tertiary)",
  };
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
      <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${t.border}` }}>
        <span style={{ color: t.text3 }}>{icon}</span>
        <h2 className="text-sm font-semibold" style={{ color: t.text }}>{title}</h2>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, children }) {
  const t = { text2: "var(--text-secondary)" };
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm" style={{ color: t.text2 }}>{label}</span>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  const t = { bg3: "var(--bg-tertiary)", border: "var(--border)", accent: "var(--accent)" };
  return (
    <button onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{ backgroundColor: checked ? "var(--accent)" : t.bg3, border: `1px solid ${t.border}` }}
      role="switch" aria-checked={checked}>
      <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }} />
    </button>
  );
}

export default Settings;
