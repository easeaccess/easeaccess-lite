import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"zn:inline-flex zn:items-center zn:justify-center zn:rounded-md zn:border zn:!px-2 zn:!py-0.5 zn:text-xs zn:font-medium zn:w-fit zn:whitespace-nowrap zn:shrink-0 zn:[&>svg]:size-3 zn:gap-1 zn:[&>svg]:pointer-events-none zn:focus-visible:border-ring zn:focus-visible:ring-ring/50 zn:focus-visible:ring-[3px] zn:aria-invalid:ring-destructive/20 zn:dark:aria-invalid:ring-destructive/40 zn:aria-invalid:border-destructive zn:transition-[color,box-shadow] zn:overflow-hidden",
	{
		variants: {
			variant: {
				default:
					"zn:border-transparent zn:!bg-primary zn:!text-primary-foreground zn:[a&]:hover:bg-primary/90",
				secondary:
					"zn:border-transparent zn:!bg-secondary zn:!text-secondary-foreground zn:[a&]:hover:!bg-secondary/90",
				destructive:
					"zn:border-transparent zn:bg-destructive zn:text-white zn:[a&]:hover:bg-destructive/90 zn:focus-visible:ring-destructive/20 zn:dark:focus-visible:ring-destructive/40 zn:dark:bg-destructive/60",
				outline:
					"zn:text-foreground zn:[a&]:hover:bg-accent zn:[a&]:hover:text-accent-foreground",
				success:
					"zn:border-transparent zn:bg-success zn:text-white zn:[a&]:hover:bg-success/90 zn:focus-visible:ring-success/20 zn:dark:focus-visible:ring-success/40 zn:dark:bg-success/60",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({ className, variant, asChild = false, ...props }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
