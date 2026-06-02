import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

function HoverCard({ ...props }) {
	return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }) {
	return (
		<HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
	);
}

function HoverCardContent({
	className,
	align = "center",
	sideOffset = 4,
	side = "top",
	...props
}) {
	return (
		<HoverCardPrimitive.Portal data-slot="hover-card-portal">
			<HoverCardPrimitive.Content
				data-slot="hover-card-content"
				align={align}
				sideOffset={sideOffset}
				side={side}
				className={cn(
					"zn:bg-popover zn:text-popover-foreground zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:data-[state=closed]:zoom-out-95 zn:data-[state=open]:zoom-in-95 zn:data-[side=bottom]:slide-in-from-top-2 zn:data-[side=left]:slide-in-from-right-2 zn:data-[side=right]:slide-in-from-left-2 zn:data-[side=top]:slide-in-from-bottom-2 zn:z-50 zn:w-64 zn:origin-(--radix-hover-card-content-transform-origin) zn:rounded-md zn:border zn:p-4 zn:shadow-md zn:outline-hidden",
					className,
				)}
				{...props}
			/>
		</HoverCardPrimitive.Portal>
	);
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
