import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    (<DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "zn:bg-background zn:group/calendar zn:p-3 zn:[--cell-size:--spacing(8)] zn:[[data-slot=card-content]_&]:bg-transparent zn:[[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("zn:w-fit", defaultClassNames.root),
        months: cn(
          "zn:flex zn:gap-4 zn:flex-col zn:md:flex-row zn:relative",
          defaultClassNames.months
        ),
        month: cn("zn:flex zn:flex-col zn:w-full zn:gap-4", defaultClassNames.month),
        nav: cn(
          "zn:flex zn:items-center zn:gap-1 zn:w-full zn:absolute zn:top-0 zn:inset-x-0 zn:justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "zn:size-(--cell-size) zn:aria-disabled:opacity-50 zn:p-0 zn:select-none",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "zn:size-(--cell-size) zn:aria-disabled:opacity-50 zn:p-0 zn:select-none",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "zn:flex zn:items-center zn:justify-center zn:h-(--cell-size) zn:w-full zn:px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "zn:w-full zn:flex zn:items-center zn:text-sm zn:font-medium zn:justify-center zn:h-(--cell-size) zn:gap-1.5",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "zn:relative zn:has-focus:border-ring zn:border zn:border-input zn:shadow-xs zn:has-focus:ring-ring/50 zn:has-focus:ring-[3px] zn:rounded-md",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "zn:absolute zn:bg-popover zn:inset-0 zn:opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn("zn:select-none zn:font-medium", captionLayout === "label"
          ? "zn:text-sm"
          : "zn:rounded-md zn:pl-2 zn:pr-1 zn:flex zn:items-center zn:gap-1 zn:text-sm zn:h-8 zn:[&>svg]:text-muted-foreground zn:[&>svg]:size-3.5", defaultClassNames.caption_label),
        table: "zn:w-full zn:border-collapse",
        weekdays: cn("zn:flex", defaultClassNames.weekdays),
        weekday: cn(
          "zn:text-muted-foreground zn:rounded-md zn:flex-1 zn:font-normal zn:text-[0.8rem] zn:select-none",
          defaultClassNames.weekday
        ),
        week: cn("zn:flex zn:w-full zn:mt-2", defaultClassNames.week),
        week_number_header: cn("zn:select-none zn:w-(--cell-size)", defaultClassNames.week_number_header),
        week_number: cn(
          "zn:text-[0.8rem] zn:select-none zn:text-muted-foreground",
          defaultClassNames.week_number
        ),
        day: cn(
          "zn:relative zn:w-full zn:h-full zn:p-0 zn:text-center zn:[&:first-child[data-selected=true]_button]:rounded-l-md zn:[&:last-child[data-selected=true]_button]:rounded-r-md zn:group/day zn:aspect-square zn:select-none",
          defaultClassNames.day
        ),
        range_start: cn("zn:rounded-l-md zn:bg-accent", defaultClassNames.range_start),
        range_middle: cn("zn:rounded-none", defaultClassNames.range_middle),
        range_end: cn("zn:rounded-r-md zn:bg-accent", defaultClassNames.range_end),
        today: cn(
          "zn:bg-accent zn:text-accent-foreground zn:rounded-md zn:data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "zn:text-muted-foreground zn:aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("zn:text-muted-foreground zn:opacity-50", defaultClassNames.disabled),
        hidden: cn("zn:invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("zn:size-4", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("zn:size-4", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("zn:size-4", className)} {...props} />);
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            (<td {...props}>
              <div
                className="zn:flex zn:size-(--cell-size) zn:items-center zn:justify-center zn:text-center">
                {children}
              </div>
            </td>)
          );
        },
        ...components,
      }}
      {...props} />)
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    (<Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "zn:data-[selected-single=true]:bg-primary zn:data-[selected-single=true]:text-primary-foreground zn:data-[range-middle=true]:bg-accent zn:data-[range-middle=true]:text-accent-foreground zn:data-[range-start=true]:bg-primary zn:data-[range-start=true]:text-primary-foreground zn:data-[range-end=true]:bg-primary zn:data-[range-end=true]:text-primary-foreground zn:group-data-[focused=true]/day:border-ring zn:group-data-[focused=true]/day:ring-ring/50 zn:dark:hover:text-accent-foreground zn:flex zn:aspect-square zn:size-auto zn:w-full zn:min-w-(--cell-size) zn:flex-col zn:gap-1 zn:leading-none zn:font-normal zn:group-data-[focused=true]/day:relative zn:group-data-[focused=true]/day:z-10 zn:group-data-[focused=true]/day:ring-[3px] zn:data-[range-end=true]:rounded-md zn:data-[range-end=true]:rounded-r-md zn:data-[range-middle=true]:rounded-none zn:data-[range-start=true]:rounded-md zn:data-[range-start=true]:rounded-l-md zn:[&>span]:text-xs zn:[&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props} />)
  );
}

export { Calendar, CalendarDayButton }
