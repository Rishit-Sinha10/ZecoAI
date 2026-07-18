import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
          <div className="text-center max-w-md px-6">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
                <AlertTriangle size={48} style={{ color: "#ef4444" }} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Something went wrong</h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Go Home
              </button>
            </div>
            {this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs cursor-pointer" style={{ color: "var(--text-tertiary)" }}>Error details</summary>
                <pre className="mt-2 p-3 rounded-lg text-[11px] overflow-x-auto" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
