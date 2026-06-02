import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}) {
  return (
    (<AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("zn:border-b zn:last:border-b-0", className)}
      {...props} />)
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return (
    (<AccordionPrimitive.Header className="zn:flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "zn:focus-visible:border-ring zn:focus-visible:ring-ring/50 zn:flex zn:flex-1 zn:items-start zn:justify-between zn:gap-4 zn:rounded-md zn:py-4 zn:text-left zn:text-sm zn:font-medium zn:transition-all zn:outline-none zn:hover:underline zn:focus-visible:ring-[3px] zn:disabled:pointer-events-none zn:disabled:opacity-50 zn:[&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}>
        {children}
        <ChevronDownIcon
          className="zn:text-muted-foreground zn:pointer-events-none zn:size-4 zn:shrink-0 zn:translate-y-0.5 zn:transition-transform zn:duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>)
  );
}

function AccordionContent({
  className,
  children,
  ...props
}) {
  return (
    (<AccordionPrimitive.Content
      data-slot="accordion-content"
      className="zn:data-[state=closed]:animate-accordion-up zn:data-[state=open]:animate-accordion-down zn:overflow-hidden zn:text-sm"
      {...props}>
      <div className={cn("zn:pt-0 zn:pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>)
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
