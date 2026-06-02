import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}) {
  return (
    (<DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:fixed zn:inset-0 zn:z-50 zn:bg-black/50",
        className
      )}
      {...props} />)
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return (
    (<DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "zn:bg-background zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:data-[state=closed]:zoom-out-95 zn:data-[state=open]:zoom-in-95 zn:fixed zn:top-[50%] zn:left-[50%] zn:z-50 zn:grid zn:w-full zn:max-w-[calc(100%-2rem)] zn:translate-x-[-50%] zn:translate-y-[-50%] zn:gap-4 zn:rounded-lg zn:border zn:p-6 zn:shadow-lg zn:duration-200 zn:sm:max-w-lg",
          className
        )}
        {...props}>
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="zn:ring-offset-background zn:focus:ring-ring zn:data-[state=open]:bg-accent zn:data-[state=open]:text-muted-foreground zn:absolute zn:top-4 zn:right-4 zn:rounded-xs zn:opacity-70 zn:transition-opacity zn:hover:opacity-100 zn:focus:ring-2 zn:focus:ring-offset-2 zn:focus:outline-hidden zn:disabled:pointer-events-none zn:[&_svg]:pointer-events-none zn:[&_svg]:shrink-0 zn:[&_svg:not([class*=size-])]:size-4">
            <XIcon />
            <span className="zn:sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>)
  );
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    (<div
      data-slot="dialog-header"
      className={cn("zn:flex zn:flex-col zn:gap-2 zn:text-center zn:sm:text-left", className)}
      {...props} />)
  );
}

function DialogFooter({
  className,
  ...props
}) {
  return (
    (<div
      data-slot="dialog-footer"
      className={cn(
        "zn:flex zn:flex-col-reverse zn:gap-2 zn:sm:flex-row zn:sm:justify-end",
        className
      )}
      {...props} />)
  );
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    (<DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("zn:text-lg zn:leading-none zn:font-semibold", className)}
      {...props} />)
  );
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    (<DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("zn:text-muted-foreground zn:text-sm", className)}
      {...props} />)
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
