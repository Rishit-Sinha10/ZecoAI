import { useState } from "react";
import { X, Sparkles, Loader2, Copy, Check, FileCode } from "lucide-react";
import { generateCode } from "../../services/aiAPI";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", ext: ".js" },
  { id: "typescript", label: "TypeScript", ext: ".ts" },
  { id: "python", label: "Python", ext: ".py" },
  { id: "java", label: "Java", ext: ".java" },
  { id: "cpp", label: "C++", ext: ".cpp" },
  { id: "go", label: "Go", ext: ".go" },
  { id: "rust", label: "Rust", ext: ".rs" },
  { id: "php", label: "PHP", ext: ".php" },
];

export default function CodeGenerator({ isOpen, onClose, onInsertCode }) {
  const [specs, setSpecs] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [filename, setFilename] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!specs.trim()) {
      setError("Please describe what you want to generate");
      return;
    }
    setIsGenerating(true);
    setError("");
    setGeneratedCode("");
    try {
      const selectedLang = LANGUAGES.find((l) => l.id === language);
      const result = await generateCode(specs, language, filename || `generated${selectedLang?.ext || ".js"}`);
      if (result.success) setGeneratedCode(result.code);
      else setError(result.message || "Generation failed");
    } catch (err) {
      setError(err.message || "Failed to generate code");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsertCode?.(generatedCode, filename || `generated.js`);
    onClose();
  };

  const handleReset = () => { setSpecs(""); setGeneratedCode(""); setError(""); setFilename(""); };

  if (!isOpen) return null;

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg3 }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: "var(--accent-light)" }}>
              <Sparkles size={20} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: t.text }}>AI Code Generator</h2>
              <p className="text-xs" style={{ color: t.text3 }}>Describe what you want, get complete code</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors" style={{ color: t.text3 }} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: t.text2 }}>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition-colors text-sm"
                style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text }}>
                {LANGUAGES.map((lang) => (<option key={lang.id} value={lang.id}>{lang.label}</option>))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: t.text2 }}>Filename (optional)</label>
              <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)}
                placeholder={`generated${LANGUAGES.find((l) => l.id === language)?.ext || ".js"}`}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none transition-colors text-sm"
                style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: t.text2 }}>What do you want to generate?</label>
            <textarea value={specs} onChange={(e) => { setSpecs(e.target.value); setError(""); }}
              placeholder="Example: Create a React component with a search input that filters a list of users..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg focus:outline-none transition-colors resize-none text-sm"
              style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text }} />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>

          <button onClick={handleGenerate} disabled={isGenerating || !specs.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--accent)" }}>
            {isGenerating ? (<><Loader2 size={18} className="animate-spin" />Generating...</>) : (<><Sparkles size={18} />Generate Code</>)}
          </button>

          {generatedCode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: t.text2 }}>Generated Code</label>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors" style={{ color: t.text2, backgroundColor: t.bg3 }}>
                    {copied ? (<><Check size={14} className="text-green-400" />Copied!</>) : (<><Copy size={14} />Copy</>)}
                  </button>
                  <button onClick={handleInsert} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg transition-colors" style={{ backgroundColor: "#10b981" }}>
                    <FileCode size={14} />Insert into Editor
                  </button>
                </div>
              </div>
              <pre className="p-4 rounded-lg border overflow-auto max-h-64 text-sm font-mono"
                style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, color: "#4ade80" }}>
                {generatedCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${t.border}`, backgroundColor: t.bg3 }}>
          <button onClick={handleReset} className="px-4 py-2 text-sm transition-colors" style={{ color: t.text3 }}>Reset</button>
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg transition-colors" style={{ color: t.text2, backgroundColor: t.bg3, border: `1px solid ${t.border}` }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
