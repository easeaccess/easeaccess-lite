import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "../../lib/utils";

function Switch({ className, ...props }) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				"zn:peer zn:data-[state=checked]:!bg-primary zn:data-[state=unchecked]:!bg-input zn:focus-visible:border-ring zn:focus-visible:ring-ring/50 zn:dark:data-[state=unchecked]:bg-input/80 zn:inline-flex zn:h-5 zn:w-10 zn:shrink-0 zn:items-center zn:!rounded-full zn:border zn:border-transparent zn:shadow-xs zn:transition-all zn:outline-none zn:focus-visible:ring-[3px] zn:disabled:cursor-not-allowed zn:disabled:opacity-50 zn:!p-0",
				className,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className={cn(
					"zn:!bg-background zn:dark:data-[state=unchecked]:!bg-foreground zn:dark:data-[state=checked]:!bg-primary-foreground zn:pointer-events-none zn:block zn:size-4 zn:!rounded-full zn:ring-0 zn:transition-transform zn:data-[state=checked]:!translate-x-5.5 zn:data-[state=unchecked]:!translate-x-0",
				)}
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
