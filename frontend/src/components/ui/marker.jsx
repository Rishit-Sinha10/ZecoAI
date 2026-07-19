import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { Check, Clock, AlertCircle, Loader2 } from "lucide-react"

const markerVariants = cva(
  "inline-flex items-center gap-1 text-xs",
  {
    variants: {
      variant: {
        timestamp: "",
        status: "",
        typing: "",
      },
    },
    defaultVariants: {
      variant: "timestamp",
    },
  }
)

function Marker({ variant = "timestamp", status, timestamp, className, ...props }) {
  const statusConfig = {
    sending: { icon: Clock, color: "var(--text-tertiary)" },
    sent: { icon: Check, color: "var(--text-tertiary)" },
    error: { icon: AlertCircle, color: "#ef4444" },
    typing: { icon: null, color: "var(--text-tertiary)" },
  }

  if (variant === "timestamp" && timestamp) {
    const date = new Date(timestamp)
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    return (
      <span
        data-slot="marker"
        data-variant="timestamp"
        className={cn(markerVariants({ variant }), className)}
        style={{ color: "var(--text-tertiary)" }}
        {...props}
      >
        {timeStr}
      </span>
    )
  }

  if (variant === "status" && status) {
    const config = statusConfig[status] || statusConfig.sending
    const Icon = config.icon

    return (
      <span
        data-slot="marker"
        data-variant="status"
        data-status={status}
        className={cn(markerVariants({ variant }), className)}
        style={{ color: config.color }}
        {...props}
      >
        {Icon && <Icon size={12} />}
        <span>{status}</span>
      </span>
    )
  }

  if (variant === "typing") {
    return (
      <span
        data-slot="marker"
        data-variant="typing"
        className={cn(markerVariants({ variant }), "gap-1.5", className)}
        style={{ color: "var(--text-tertiary)" }}
        {...props}
      >
        <span className="flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--accent)", animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--accent)", animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--accent)", animationDelay: "300ms" }} />
        </span>
        <span className="text-xs">Thinking...</span>
      </span>
    )
  }

  return null
}

export { Marker, markerVariants }
