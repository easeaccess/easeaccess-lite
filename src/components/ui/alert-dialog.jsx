import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function AlertDialog({ ...props }) {
	return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	);
}

function AlertDialogPortal({ ...props }) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	);
}

function AlertDialogOverlay({ className, ...props }) {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot="alert-dialog-overlay"
			className={cn(
				"zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:fixed zn:inset-0 zn:z-50 zn:bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogContent({ className, ...props }) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-slot="alert-dialog-content"
				className={cn(
					"zn:bg-background zn:data-[state=open]:animate-in zn:data-[state=closed]:animate-out zn:data-[state=closed]:fade-out-0 zn:data-[state=open]:fade-in-0 zn:data-[state=closed]:zoom-out-95 zn:data-[state=open]:zoom-in-95 zn:fixed zn:top-[50%] zn:left-[50%] zn:z-50 zn:grid zn:w-full zn:max-w-[calc(100%-2rem)] zn:translate-x-[-50%] zn:translate-y-[-50%] zn:gap-4 zn:rounded-lg zn:border zn:p-6 zn:shadow-lg zn:duration-200 zn:sm:max-w-lg",
					className,
				)}
				{...props}
			/>
		</AlertDialogPortal>
	);
}

function AlertDialogHeader({ className, ...props }) {
	return (
		<div
			data-slot="alert-dialog-header"
			className={cn(
				"zn:flex zn:flex-col zn:gap-2 zn:text-center zn:sm:text-left",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogFooter({ className, ...props }) {
	return (
		<div
			data-slot="alert-dialog-footer"
			className={cn(
				"zn:flex zn:flex-col-reverse zn:gap-2 zn:sm:flex-row zn:sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function AlertDialogTitle({ className, ...props }) {
	return (
		<AlertDialogPrimitive.Title
			data-slot="alert-dialog-title"
			className={cn("zn:text-lg zn:font-semibold", className)}
			{...props}
		/>
	);
}

function AlertDialogDescription({ className, ...props }) {
	return (
		<AlertDialogPrimitive.Description
			data-slot="alert-dialog-description"
			className={cn("zn:text-muted-foreground zn:text-sm", className)}
			{...props}
		/>
	);
}

function AlertDialogAction({ className, ...props }) {
	return (
		<AlertDialogPrimitive.Action
			className={cn(buttonVariants(), className)}
			{...props}
		/>
	);
}

function AlertDialogCancel({ className, ...props }) {
	return (
		<AlertDialogPrimitive.Cancel
			className={cn(buttonVariants({ variant: "outline" }), className)}
			{...props}
		/>
	);
}

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};
