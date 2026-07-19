import { Toaster as Sonner } from "sonner"

function Toaster({ ...props }) {
  return (
    <Sonner
      className="toaster group"
      style={{
        "--normal-bg": "var(--bg-tertiary)",
        "--normal-text": "var(--text-primary)",
        "--normal-border": "var(--border)",
        "--success-bg": "var(--bg-tertiary)",
        "--success-text": "var(--text-primary)",
        "--success-border": "var(--border)",
      }}
      {...props}
    />
  )
}

export { Toaster }
