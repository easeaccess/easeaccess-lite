import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/utils";

function TooltipProvider({ delayDuration = 0, ...props }) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({ ...props }) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger({ ...props }) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({ className, sideOffset = 0, children, ...props }) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				className={cn(
					"zn:!bg-foreground zn:!text-background zn:animate-in zn:fade-in-0 zn:zoom-in-95 zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=closed]:zoom-out-95 zn:data-[side=bottom]:slide-in-from-top-2 zn:data-[side=left]:slide-in-from-right-2 zn:data-[side=right]:slide-in-from-left-2 zn:data-[side=top]:slide-in-from-bottom-2 zn:z-[10000000000000000000000000] zn:w-fit zn:origin-(--radix-tooltip-content-transform-origin) zn:rounded-md zn:!px-3 zn:!py-1.5 zn:!text-xs zn:text-balance",
					className,
				)}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className="zn:bg-foreground zn:fill-foreground zn:z-50 zn:size-2.5 zn:translate-y-[calc(-50%_-_2px)] zn:rotate-45 zn:rounded-[2px]" />
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
