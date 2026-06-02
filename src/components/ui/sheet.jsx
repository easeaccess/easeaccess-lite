import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Sheet({ ...props }) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }) {
	return (
		<SheetPrimitive.Overlay
			data-slot="sheet-overlay"
			className={cn(
				"zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:fixed zn:inset-0 zn:z-[999999999] zn:bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

function SheetContent({
	className,
	children,
	side = "right",
	hideCloseButton = false,
	hideOverlay = false,
	title,
	...props
}) {
	// Radix Dialog requires either an aria-label, aria-labelledby, or a Title
	// child. To prevent the axe `aria-dialog-name` rule from flagging consumers
	// that forget, we auto-inject a visually-hidden SheetTitle as a fallback.
	const hasAriaLabel = props["aria-label"] || props["aria-labelledby"];
	const fallbackTitle = title || "Dialog";
	return (
		<SheetPortal>
			{!hideOverlay && <SheetOverlay />}
			<SheetPrimitive.Content
				data-slot="sheet-content"
				className={cn(
					"zn:!bg-background zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:fixed zn:z-[999999999] zn:flex zn:flex-col zn:gap-4 zn:shadow-lg zn:transition zn:ease-in-out zn:data-[state=closed]:duration-300 zn:data-[state=open]:duration-500",
					side === "right" &&
						"zn:data-[state=closed]:slide-out-to-right zn:data-[state=open]:slide-in-from-right zn:inset-y-0 zn:right-0 zn:h-full zn:w-3/4 zn:border-l zn:sm:max-w-sm",
					side === "left" &&
						"zn:data-[state=closed]:slide-out-to-left zn:data-[state=open]:slide-in-from-left zn:inset-y-0 zn:left-0 zn:h-full zn:w-3/4 zn:border-r zn:sm:max-w-sm",
					side === "top" &&
						"zn:data-[state=closed]:slide-out-to-top zn:data-[state=open]:slide-in-from-top zn:inset-x-0 zn:top-0 zn:h-auto zn:border-b",
					side === "bottom" &&
						"zn:data-[state=closed]:slide-out-to-bottom zn:data-[state=open]:slide-in-from-bottom zn:inset-x-0 zn:bottom-0 zn:h-auto zn:border-t",
					className,
				)}
				{...props}
			>
				{!hasAriaLabel && (
					<SheetPrimitive.Title className="zn:sr-only">
						{fallbackTitle}
					</SheetPrimitive.Title>
				)}
				{children}
				{hideCloseButton === false && (
					<SheetPrimitive.Close className="zn:ring-offset-background zn:focus:ring-ring zn:data-[state=open]:bg-secondary zn:absolute zn:top-4 zn:right-4 zn:rounded-xs zn:opacity-70 zn:transition-opacity zn:hover:opacity-100 zn:focus:ring-2 zn:focus:ring-offset-2 zn:focus:outline-hidden zn:disabled:pointer-events-none">
						<XIcon className="zn:size-4" />
						<span className="zn:sr-only">Close</span>
					</SheetPrimitive.Close>
				)}
			</SheetPrimitive.Content>
		</SheetPortal>
	);
}

function SheetHeader({ className, ...props }) {
	return (
		<div
			data-slot="sheet-header"
			className={cn("zn:flex zn:flex-col zn:gap-1.5 zn:!p-4", className)}
			{...props}
		/>
	);
}

function SheetFooter({ className, ...props }) {
	return (
		<div
			data-slot="sheet-footer"
			className={cn(
				"zn:mt-auto zn:flex zn:flex-col zn:gap-2 zn:p-4",
				className,
			)}
			{...props}
		/>
	);
}

function SheetTitle({ className, ...props }) {
	return (
		<SheetPrimitive.Title
			data-slot="sheet-title"
			className={cn("zn:text-foreground zn:font-semibold", className)}
			{...props}
		/>
	);
}

function SheetDescription({ className, ...props }) {
	return (
		<SheetPrimitive.Description
			data-slot="sheet-description"
			className={cn("zn:text-muted-foreground zn:text-sm", className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetTrigger,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
};
