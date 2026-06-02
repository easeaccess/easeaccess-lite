import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
	return (
		<div
			data-slot="card"
			className={cn(
				"zn:bg-card zn:text-card-foreground zn:flex zn:flex-col zn:gap-6 zn:rounded-xl zn:border zn:border-default-200 zn:py-6 ",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"zn:@container/card-header zn:grid zn:auto-rows-min zn:grid-rows-[auto_auto] zn:items-start zn:gap-1.5 zn:px-6 zn:has-data-[slot=card-action]:grid-cols-[1fr_auto] zn:[.border-b]:pb-6",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }) {
	return (
		<div
			data-slot="card-title"
			className={cn(
				" zn:font-medium zn:text-lg zn:leading-5 zn:text-default-800",
				className,
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }) {
	return (
		<div
			data-slot="card-description"
			className={cn("zn:text-default-600 zn:text-sm", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"zn:col-start-2 zn:row-span-2 zn:row-start-1 zn:self-start zn:justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }) {
	return (
		<div
			data-slot="card-content"
			className={cn("zn:px-6", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				"zn:flex zn:items-center zn:px-6 zn:[.border-t]:pt-6",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
