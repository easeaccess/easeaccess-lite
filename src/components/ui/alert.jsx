import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "zn:relative zn:grid zn:w-full zn:grid-cols-[0_1fr] zn:items-start zn:gap-y-0.5 zn:rounded-lg zn:border zn:px-4 zn:py-3 zn:text-sm zn:has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] zn:has-[>svg]:gap-x-3 zn:[&>svg]:size-4 zn:[&>svg]:translate-y-0.5 zn:[&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "zn:bg-card zn:text-card-foreground",
        destructive:
          "zn:bg-card zn:text-destructive zn:*:data-[slot=alert-description]:text-destructive/90 zn:[&>svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props} />
  );
}

function AlertTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "zn:col-start-2 zn:line-clamp-1 zn:min-h-4 zn:font-medium zn:tracking-tight",
        className
      )}
      {...props} />
  );
}

function AlertDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "zn:col-start-2 zn:grid zn:justify-items-start zn:gap-1 zn:text-sm zn:text-muted-foreground zn:[&_p]:leading-relaxed",
        className
      )}
      {...props} />
  );
}

export { Alert, AlertTitle, AlertDescription }
