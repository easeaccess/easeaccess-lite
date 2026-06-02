import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({ className, activeClassName, value, ...props }) {
	// Ensure progressbar has an accessible name (axe rule: aria-progressbar-name).
	// Consumers can override with their own aria-label / aria-labelledby.
	const a11yProps = {
		"aria-label":
			props["aria-label"] ||
			(props["aria-labelledby"] ? undefined : "Progress"),
		...props,
	};
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				"zn:!bg-primary/20 zn:relative zn:h-2 zn:w-full zn:overflow-hidden zn:rounded-full",
				className,
			)}
			{...a11yProps}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className={cn(
					"zn:!bg-primary zn:h-full zn:w-full zn:flex-1 zn:transition-all",
					activeClassName,
				)}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
