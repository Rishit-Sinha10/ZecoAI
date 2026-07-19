import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const messageBubbleVariants = cva(
  "relative max-w-xs lg:max-w-md px-4 py-3 rounded-lg transition-colors",
  {
    variants: {
      variant: {
        user: "rounded-br-none",
        assistant: "rounded-bl-none border",
      },
    },
    defaultVariants: {
      variant: "assistant",
    },
  }
)

function MessageBubble({ message, isUser, className, children, ...props }) {
  const variant = isUser ? "user" : "assistant"

  return (
    <div
      data-slot="message-bubble"
      data-variant={variant}
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start",
        "mb-4",
        className
      )}
      {...props}
    >
      <div
        className={cn(messageBubbleVariants({ variant }))}
        style={{
          backgroundColor: isUser ? "var(--accent)" : "var(--bg-tertiary)",
          color: isUser ? "white" : "var(--text-primary)",
          borderColor: isUser ? "none" : "var(--border)",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export { MessageBubble, messageBubbleVariants }
