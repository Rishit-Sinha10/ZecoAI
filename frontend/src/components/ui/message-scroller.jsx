import * as React from "react"
import { cn } from "@/lib/utils"

const MessageScroller = React.forwardRef(function MessageScroller(
  { className, children, ...props },
  ref
) {
  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRef(ref, innerRef)

  React.useEffect(() => {
    if (innerRef.current) {
      innerRef.current.scrollTop = innerRef.current.scrollHeight
    }
  }, [children])

  return (
    <div
      ref={combinedRef}
      data-slot="message-scroller"
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4",
        "scroll-smooth",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

function useCombinedRef(...refs) {
  return React.useCallback(
    (node) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      })
    },
    [refs]
  )
}

export { MessageScroller }
