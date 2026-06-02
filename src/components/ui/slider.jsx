import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = React.useMemo(() =>
    Array.isArray(value)
      ? value
      : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max], [value, defaultValue, min, max])

  return (
    (<SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "zn:relative zn:flex zn:w-full zn:touch-none zn:items-center zn:select-none zn:data-[disabled]:opacity-50 zn:data-[orientation=vertical]:h-full zn:data-[orientation=vertical]:min-h-44 zn:data-[orientation=vertical]:w-auto zn:data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}>
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "zn:bg-muted zn:relative zn:grow zn:overflow-hidden zn:rounded-full zn:data-[orientation=horizontal]:h-1.5 zn:data-[orientation=horizontal]:w-full zn:data-[orientation=vertical]:h-full zn:data-[orientation=vertical]:w-1.5"
        )}>
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "zn:bg-primary zn:absolute zn:data-[orientation=horizontal]:h-full zn:data-[orientation=vertical]:w-full"
          )} />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="zn:border-primary zn:bg-background zn:ring-ring/50 zn:block zn:size-4 zn:shrink-0 zn:rounded-full zn:border zn:shadow-sm zn:transition-[color,box-shadow] zn:hover:ring-4 zn:focus-visible:ring-4 zn:focus-visible:outline-hidden zn:disabled:pointer-events-none zn:disabled:opacity-50" />
      ))}
    </SliderPrimitive.Root>)
  );
}

export { Slider }
