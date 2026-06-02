import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "../../lib/utils";

function RadioGroup({ className, ...props }) {
	return (
		<RadioGroupPrimitive.Root
			data-slot="radio-group"
			className={cn("zn:grid zn:gap-3", className)}
			{...props}
		/>
	);
}

function RadioGroupItem({ className, ...props }) {
	return (
		<RadioGroupPrimitive.Item
			data-slot="radio-group-item"
			className={cn(
				"zn:!border-default-800 zn:!text-primary zn:focus-visible:border-ring zn:focus-visible:ring-ring/50 zn:aria-invalid:ring-destructive/20 zn:dark:aria-invalid:ring-destructive/40 zn:aria-invalid:border-destructive zn:dark:bg-input/30 zn:aspect-square zn:size-4 zn:shrink-0 zn:!rounded-full zn:border zn:shadow-xs zn:transition-[color,box-shadow] zn:outline-none zn:focus-visible:ring-[3px] zn:disabled:cursor-not-allowed zn:disabled:opacity-50",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator
				data-slot="radio-group-indicator"
				className="zn:relative zn:flex zn:items-center zn:justify-center"
			>
				<CircleIcon className="zn:fill-primary zn:absolute zn:top-1/2 zn:left-1/2 zn:size-2 zn:-translate-x-1/2 zn:-translate-y-1/2" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}

export { RadioGroup, RadioGroupItem };
