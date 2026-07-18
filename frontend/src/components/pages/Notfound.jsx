import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="text-center max-w-md px-6">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--bg-tertiary)" }}>
            <FileQuestion size={48} style={{ color: "var(--text-tertiary)", opacity: 0.5 }} />
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>404</h1>
        <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Page not found</h2>
        <p className="text-sm mb-8" style={{ color: "var(--text-tertiary)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <Home size={16} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
