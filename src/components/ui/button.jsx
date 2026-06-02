import * as React from "react";
import { useState, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"zn:relative zn:inline-flex zn:!border-0 zn:items-center  zn:justify-center zn:gap-2 zn:whitespace-nowrap zn:!rounded-md zn:text-sm zn:font-medium zn:transition-all zn:disabled:pointer-events-none zn:disabled:opacity-50 zn:[&_svg]:pointer-events-none zn:[&_svg:not([class*=size-])]:size-4 zn:shrink-0 zn:[&_svg]:shrink-0 zn:outline-none zn:focus-visible:border-ring zn:focus-visible:ring-ring/50 zn:focus-visible:ring-[3px] zn:aria-invalid:ring-destructive/20 zn:dark:aria-invalid:ring-destructive/40 zn:aria-invalid:border-destructive zn:overflow-hidden zn:active:scale-[0.97]",
	{
		variants: {
			variant: {
				default:
					"zn:!bg-primary zn:!text-primary-foreground zn:shadow-xs zn:hover:bg-primary/90",
				destructive:
					"zn:!bg-destructive zn:!text-white zn:shadow-xs zn:hover:bg-destructive/90 zn:focus-visible:ring-destructive/20 zn:dark:focus-visible:ring-destructive/40 zn:dark:bg-destructive/60",
				outline:
					"zn:!border zn:!bg-background zn:shadow-xs zn:hover:bg-accent zn:hover:!text-accent-foreground zn:dark:bg-input/30 zn:dark:border-input zn:dark:hover:bg-input/50",
				secondary:
					"zn:!bg-secondary zn:!text-secondary-foreground zn:shadow-xs zn:hover:bg-secondary/80",
				ghost:
					"zn:!hover:bg-accent zn:!hover:text-accent-foreground zn:dark:hover:bg-accent/50",
				link: "zn:!text-primary zn:underline-offset-4 zn:hover:underline",
			},
			size: {
				default: "zn:h-9 zn:px-4 zn:py-2 zn:has-[>svg]:px-3",
				sm: "zn:h-8 zn:rounded-md zn:gap-1.5 zn:px-3 zn:has-[>svg]:px-2.5",
				lg: "zn:h-10 zn:rounded-md zn:px-6 zn:has-[>svg]:px-4",
				icon: "zn:size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	onClick,
	disabled,
	...props
}) {
	const [ripples, setRipples] = useState([]);
	const Comp = asChild ? Slot : "button";

	useEffect(() => {
		const styleId = "zn-ripple-animation-style";
		if (document.getElementById(styleId)) return;

		const style = document.createElement("style");
		style.id = styleId;
		style.innerHTML = `
      @keyframes zn-ripple-effect {
        from {
          transform: scale(0);
          opacity: 1;
        }
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
      .zn-animate-ripple {
        animation: zn-ripple-effect 0.7s ease-out forwards;
      }
    `;
		document.head.appendChild(style);
	}, []);

	const createRipple = (event) => {
		if (disabled || asChild) {
			onClick?.(event);
			return;
		}

		const button = event.currentTarget;
		const rect = button.getBoundingClientRect();
		const rippleSize = Math.max(rect.width, rect.height);
		const x = event.clientX - rect.left - rippleSize / 2;
		const y = event.clientY - rect.top - rippleSize / 2;

		const newRipple = { x, y, size: rippleSize, id: Date.now() };

		setRipples((currentRipples) => [...currentRipples, newRipple]);

		setTimeout(() => {
			setRipples((currentRipples) => currentRipples.slice(1));
		}, 700);

		onClick?.(event);
	};

	const rippleColor =
		variant === "default" || variant === "destructive"
			? "zn:bg-white/50"
			: "zn:bg-white/50 ";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			onClick={createRipple}
			disabled={disabled}
			{...props}
		>
			{!asChild && (
				<>
					<span className="zn:relative zn:z-10 zn:flex zn:items-center zn:gap-2">
						{props.children}
					</span>
					<div className="zn:absolute zn:inset-0 zn:z-0">
						{ripples.map((ripple) => (
							<span
								key={ripple.id}
								className={cn(
									"zn:absolute zn:rounded-full zn-animate-ripple",
									rippleColor,
								)}
								style={{
									left: ripple.x,
									top: ripple.y,
									width: ripple.size,
									height: ripple.size,
								}}
							/>
						))}
					</div>
				</>
			)}
			{asChild && props.children}
		</Comp>
	);
}

export { Button, buttonVariants };
