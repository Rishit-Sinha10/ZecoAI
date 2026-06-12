import { X, Copy, Download } from "lucide-react";
import { useState } from "react";

/**
 * Terminal Component
 * Displays code execution output and errors
 */
function Terminal({ output, error, isLoading, onClose, executionTime }) {
  const [copied, setCopied] = useState(false);

  const handleCopyOutput = () => {
    const text = output || error || "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOutput = () => {
    const text = output || error || "";
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", "output.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">
          <span className="text-white font-semibold">Terminal</span>
          {executionTime && (
            <span className="text-white/50 text-xs ml-2">({executionTime.toFixed(2)}ms)</span>
          )}
        </div>
        <div className="terminal-actions">
          <button
            onClick={handleCopyOutput}
            className="terminal-button"
            title="Copy output"
          >
            <Copy size={16} />
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownloadOutput}
            className="terminal-button"
            title="Download output"
          >
            <Download size={16} />
          </button>
          <button onClick={onClose} className="terminal-button" title="Close terminal">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="terminal-output">
        {isLoading && (
          <div className="terminal-loading">
            <div className="spinner"></div>
            <span>Executing code...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="terminal-error">
            <span className="error-label">Error:</span>
            <pre>{error}</pre>
          </div>
        )}

        {!isLoading && !error && output && (
          <div className="terminal-success">
            <span className="output-label">Output:</span>
            <pre>{output}</pre>
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
