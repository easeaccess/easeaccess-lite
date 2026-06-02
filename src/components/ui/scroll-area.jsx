import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}) {
  return (
    (<ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("zn:relative", className)}
      {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="zn:focus-visible:ring-ring/50 zn:size-full zn:rounded-[inherit] zn:transition-[color,box-shadow] zn:outline-none zn:focus-visible:ring-[3px] zn:focus-visible:outline-1">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>)
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return (
    (<ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "zn:flex zn:touch-none zn:p-px zn:transition-colors zn:select-none",
        orientation === "vertical" &&
          "zn:h-full zn:w-2.5 zn:border-l zn:border-l-transparent",
        orientation === "horizontal" &&
          "zn:h-2.5 zn:flex-col zn:border-t zn:border-t-transparent",
        className
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="zn:bg-border zn:relative zn:flex-1 zn:rounded-full" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>)
  );
}

export { ScrollArea, ScrollBar }
