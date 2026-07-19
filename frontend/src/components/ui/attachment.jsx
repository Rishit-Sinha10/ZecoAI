import * as React from "react"
import { cn } from "@/lib/utils"
import { File, FileText, FileCode, Image, FileArchive, X } from "lucide-react"

const fileIcons = {
  image: Image,
  text: FileText,
  code: FileCode,
  archive: FileArchive,
  default: File,
}

function getFileType(filename) {
  const ext = filename.split(".").pop()?.toLowerCase()
  if (["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp"].includes(ext)) return "image"
  if (["js", "jsx", "ts", "tsx", "py", "java", "cpp", "c", "go", "rs", "rb", "php"].includes(ext)) return "code"
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext)) return "archive"
  if (["txt", "md", "json", "csv", "xml", "yaml", "yml"].includes(ext)) return "text"
  return "default"
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function Attachment({ filename, size, onRemove, className, ...props }) {
  const fileType = getFileType(filename)
  const Icon = fileIcons[fileType]

  return (
    <div
      data-slot="attachment"
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
        "hover:bg-[var(--bg-secondary)]",
        className
      )}
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
      {...props}
    >
      <Icon
        size={16}
        className="shrink-0"
        style={{ color: "var(--accent)" }}
      />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate max-w-[180px]">
          {filename}
        </span>
        {size != null && (
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {formatFileSize(size)}
          </span>
        )}
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="shrink-0 ml-1 rounded p-0.5 transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

function AttachmentList({ attachments = [], onRemove, className }) {
  if (!attachments.length) return null

  return (
    <div
      data-slot="attachment-list"
      className={cn("flex flex-wrap gap-2 mt-2", className)}
    >
      {attachments.map((att, i) => (
        <Attachment
          key={i}
          filename={att.name || att.filename}
          size={att.size}
          onRemove={onRemove ? () => onRemove(i) : undefined}
        />
      ))}
    </div>
  )
}

export { Attachment, AttachmentList, getFileType, formatFileSize }
