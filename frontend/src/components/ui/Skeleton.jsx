export default function Skeleton({ className = "", count = 1, style }) {
  const baseStyle = {
    backgroundColor: "var(--bg-tertiary)",
    borderRadius: "6px",
    animation: "skeleton-pulse 1.5s ease-in-out infinite",
  };

  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className={className} style={style}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={baseStyle} className="w-full" />
        ))}
      </div>
    </>
  );
}

export function ProjectCardSkeleton() {
  const baseStyle = {
    backgroundColor: "var(--bg-tertiary)",
    borderRadius: "6px",
    animation: "skeleton-pulse 1.5s ease-in-out infinite",
  };

  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
        <div className="px-6 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg" style={baseStyle} />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 rounded" style={baseStyle} />
              <div className="h-3 w-1/4 rounded" style={baseStyle} />
            </div>
          </div>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="h-4 w-1/3 rounded" style={baseStyle} />
          <div className="h-3 w-1/2 rounded" style={baseStyle} />
          <div className="h-3 w-2/3 rounded" style={baseStyle} />
        </div>
        <div className="px-6 py-4 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="h-9 flex-1 rounded-lg" style={baseStyle} />
          <div className="h-9 w-9 rounded-lg" style={baseStyle} />
          <div className="h-9 w-9 rounded-lg" style={baseStyle} />
        </div>
      </div>
    </>
  );
}

export function ChatListSkeleton() {
  const baseStyle = {
    backgroundColor: "var(--bg-tertiary)",
    borderRadius: "6px",
    animation: "skeleton-pulse 1.5s ease-in-out infinite",
  };

  return (
    <>
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)" }}>
            <div className="h-4 w-3/4 rounded mb-2" style={baseStyle} />
            <div className="h-3 w-1/2 rounded" style={baseStyle} />
          </div>
        ))}
      </div>
    </>
  );
}
