import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "../../lib/utils";

function Checkbox({ className, ...props }) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"zn:peer zn:!border-input zn:dark:bg-input/30 zn:data-[state=checked]:!bg-primary zn:data-[state=checked]:!text-primary-foreground zn:dark:data-[state=checked]:bg-primary zn:data-[state=checked]:!border-primary zn:focus-visible:border-ring zn:focus-visible:!ring-ring/50 zn:aria-invalid:ring-destructive/20 zn:dark:aria-invalid:ring-destructive/40 zn:aria-invalid:border-destructive zn:!size-4 zn:shrink-0 zn:!rounded-[4px] zn:!border zn:!shadow-xs zn:transition-shadow zn:!outline-none zn:focus-visible:ring-[3px] zn:disabled:!cursor-not-allowed zn:disabled:!opacity-50 zn:flex zn:items-center zn:justify-center",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="zn:!flex zn:!items-center zn:!justify-center zn:!text-current zn:transition-none"
			>
				<CheckIcon className="zn:!size-3.5" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
