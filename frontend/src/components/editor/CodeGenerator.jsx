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
      const result = await generateCode(
        specs,
        language,
        filename || `generated${selectedLang?.ext || ".js"}`
      );

      if (result.success) {
        setGeneratedCode(result.code);
      } else {
        setError(result.message || "Generation failed");
      }
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

  const handleReset = () => {
    setSpecs("");
    setGeneratedCode("");
    setError("");
    setFilename("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700 bg-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Sparkles size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                AI Code Generator
              </h2>
              <p className="text-xs text-white/50">
                Describe what you want, get complete code
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-700 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Language & Filename */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Filename (optional)
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder={`generated${
                  LANGUAGES.find((l) => l.id === language)?.ext || ".js"
                }`}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              What do you want to generate?
            </label>
            <textarea
              value={specs}
              onChange={(e) => {
                setSpecs(e.target.value);
                setError("");
              }}
              placeholder="Example: Create a React component with a search input that filters a list of users..."
              rows={4}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !specs.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Code
              </>
            )}
          </button>

          {/* Generated Code Output */}
          {generatedCode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/70">
                  Generated Code
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleInsert}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
                  >
                    <FileCode size={14} />
                    Insert into Editor
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-zinc-950 rounded-lg border border-zinc-700 overflow-auto max-h-64 text-sm text-green-400 font-mono">
                {generatedCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-700 bg-zinc-800/50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Reset
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-white/70 hover:text-white bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
