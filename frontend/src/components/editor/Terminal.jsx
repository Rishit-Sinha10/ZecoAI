import { X, Copy, Download, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Terminal({ output, error, isLoading, onClose, executionTime, exitCode, memory, onFixWithAI, isFixing }) {
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, error, isLoading]);

  const handleCopyOutput = () => {
    const text = output || error || "";
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOutput = () => {
    const text = output || error || "";
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatMemory = (bytes) => {
    if (!bytes) return null;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const memStr = formatMemory(memory);

  const getStatusDot = () => {
    if (isLoading) return "terminal-dot--running";
    if (exitCode !== null && exitCode !== undefined && exitCode !== 0) return "terminal-dot--error";
    if (exitCode === 0) return "terminal-dot--success";
    return "terminal-dot--idle";
  };

  return (
    <div className="terminal-container" role="region" aria-label="Terminal output">
      {/* Header */}
      <div className="terminal-header">
        <div className="terminal-title">
          <span className={`terminal-dot ${getStatusDot()}`} />
          <span>Terminal</span>

          <div className="terminal-stats">
            {executionTime > 0 && (
              <span className="terminal-stat">{executionTime}s</span>
            )}
            {exitCode !== null && exitCode !== undefined && (
              <span className={`terminal-stat ${exitCode === 0 ? "terminal-stat--exit-ok" : "terminal-stat--exit-err"}`}>
                exit {exitCode}
              </span>
            )}
            {memStr && (
              <span className="terminal-stat">{memStr}</span>
            )}
          </div>
        </div>

        <div className="terminal-actions">
          <button
            onClick={handleCopyOutput}
            className="terminal-button"
            title="Copy output"
            aria-label="Copy output"
          >
            <Copy size={13} />
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownloadOutput}
            className="terminal-button"
            title="Download output"
            aria-label="Download output"
          >
            <Download size={13} />
          </button>
          <button
            onClick={onClose}
            className="terminal-button terminal-button--danger"
            title="Close terminal"
            aria-label="Close terminal"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="terminal-output" ref={outputRef}>
        {isLoading && (
          <div className="terminal-loading">
            <div className="terminal-spinner" />
            <span>Executing code...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="terminal-block">
            <div className="flex items-center justify-between">
              <span className="terminal-block-label terminal-block-label--error">Error</span>
              {onFixWithAI && (
                <button
                  onClick={onFixWithAI}
                  disabled={isFixing}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors"
                  style={{
                    backgroundColor: isFixing ? "var(--bg-tertiary)" : "rgba(251,191,36,0.1)",
                    color: isFixing ? "var(--text-tertiary)" : "#fbbf24",
                    border: "1px solid rgba(251,191,36,0.2)",
                  }}
                >
                  {isFixing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {isFixing ? "Fixing..." : "Fix with AI"}
                </button>
              )}
            </div>
            <div className="terminal-error">
              <pre>{error}</pre>
            </div>
          </div>
        )}

        {!isLoading && !error && output && (
          <div className="terminal-block">
            <span className="terminal-block-label terminal-block-label--output">Output</span>
            <div className="terminal-success">
              <pre>{output}</pre>
            </div>
          </div>
        )}

        {!isLoading && !error && !output && (
          <div className="terminal-empty">
            <p>No output</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Terminal;
