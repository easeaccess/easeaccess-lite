import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

function Popover({ ...props }) {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }) {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
	className,
	align = "center",
	sideOffset = 4,
	side,
	...props
}) {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				data-slot="popover-content"
				align={align}
				sideOffset={sideOffset}
				side={side}
				className={cn(
					"zn:!bg-popover zn:!text-popover-foreground zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:data-[state=closed]:zoom-out-95 zn:data-[state=open]:zoom-in-95 zn:data-[side=bottom]:slide-in-from-top-2 zn:data-[side=left]:slide-in-from-right-2 zn:data-[side=right]:slide-in-from-left-2 zn:data-[side=top]:slide-in-from-bottom-2 zn:!z-[999999] zn:w-72 zn:origin-(--radix-popover-content-transform-origin) zn:rounded-md zn:border zn:!p-4 zn:!shadow-md zn:outline-hidden",
					className,
				)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	);
}

function PopoverAnchor({ ...props }) {
	return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
