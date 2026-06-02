import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "../../lib/utils"

function Select({
  ...props
}) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return (
    (<SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "zn:border-input zn:data-[placeholder]:text-muted-foreground zn:[&_svg:not([class*=text-])]:text-muted-foreground zn:focus-visible:border-ring zn:focus-visible:ring-ring/50 zn:aria-invalid:ring-destructive/20 zn:dark:aria-invalid:ring-destructive/40 zn:aria-invalid:border-destructive zn:dark:bg-input/30 zn:dark:hover:bg-input/50 zn:flex zn:w-fit zn:items-center zn:justify-between zn:gap-2 zn:rounded-md zn:border zn:bg-transparent zn:px-3 zn:py-2 zn:text-sm zn:whitespace-nowrap zn:shadow-xs zn:transition-[color,box-shadow] zn:outline-none zn:focus-visible:ring-[3px] zn:disabled:cursor-not-allowed zn:disabled:opacity-50 zn:data-[size=default]:h-9 zn:data-[size=sm]:h-8 zn:*:data-[slot=select-value]:line-clamp-1 zn:*:data-[slot=select-value]:flex zn:*:data-[slot=select-value]:items-center zn:*:data-[slot=select-value]:gap-2 zn:[&_svg]:pointer-events-none zn:[&_svg]:shrink-0 zn:[&_svg:not([class*=size-])]:size-4",
        className
      )}
      {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="zn:size-4 zn:opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>)
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return (
    (<SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "zn:bg-popover zn:text-popover-foreground zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:data-[state=closed]:zoom-out-95 zn:data-[state=open]:zoom-in-95 zn:data-[side=bottom]:slide-in-from-top-2 zn:data-[side=left]:slide-in-from-right-2 zn:data-[side=right]:slide-in-from-left-2 zn:data-[side=top]:slide-in-from-bottom-2 zn:relative zn:z-50 zn:max-h-(--radix-select-content-available-height) zn:min-w-[8rem] zn:origin-(--radix-select-content-transform-origin) zn:overflow-x-hidden zn:overflow-y-auto zn:rounded-md zn:border zn:shadow-md",
          position === "popper" &&
            "zn:data-[side=bottom]:translate-y-1 zn:data-[side=left]:-translate-x-1 zn:data-[side=right]:translate-x-1 zn:data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}>
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn("zn:p-1", position === "popper" &&
            "zn:h-[var(--radix-select-trigger-height)] zn:w-full zn:min-w-[var(--radix-select-trigger-width)] zn:scroll-my-1")}>
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>)
  );
}

function SelectLabel({
  className,
  ...props
}) {
  return (
    (<SelectPrimitive.Label
      data-slot="select-label"
      className={cn("zn:text-muted-foreground zn:px-2 zn:py-1.5 zn:text-xs", className)}
      {...props} />)
  );
}

function SelectItem({
  className,
  children,
  ...props
}) {
  return (
    (<SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "zn:focus:bg-accent zn:focus:text-accent-foreground zn:[&_svg:not([class*=text-])]:text-muted-foreground zn:relative zn:flex zn:w-full zn:cursor-default zn:items-center zn:gap-2 zn:rounded-sm zn:py-1.5 zn:pr-8 zn:pl-2 zn:text-sm zn:outline-hidden zn:select-none zn:data-[disabled]:pointer-events-none zn:data-[disabled]:opacity-50 zn:[&_svg]:pointer-events-none zn:[&_svg]:shrink-0 zn:[&_svg:not([class*=size-])]:size-4 zn:*:[span]:last:flex zn:*:[span]:last:items-center zn:*:[span]:last:gap-2",
        className
      )}
      {...props}>
      <span
        className="zn:absolute zn:right-2 zn:flex zn:size-3.5 zn:items-center zn:justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="zn:size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>)
  );
}

function SelectSeparator({
  className,
  ...props
}) {
  return (
    (<SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("zn:bg-border zn:pointer-events-none zn:-mx-1 zn:my-1 zn:h-px", className)}
      {...props} />)
  );
}

function SelectScrollUpButton({
  className,
  ...props
}) {
  return (
    (<SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "zn:flex zn:cursor-default zn:items-center zn:justify-center zn:py-1",
        className
      )}
      {...props}>
      <ChevronUpIcon className="zn:size-4" />
    </SelectPrimitive.ScrollUpButton>)
  );
}

function SelectScrollDownButton({
  className,
  ...props
}) {
  return (
    (<SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "zn:flex zn:cursor-default zn:items-center zn:justify-center zn:py-1",
        className
      )}
      {...props}>
      <ChevronDownIcon className="zn:size-4" />
    </SelectPrimitive.ScrollDownButton>)
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
