"use client";

import { motion } from "framer-motion";
import { useAnimation } from "@/context/animation-provider";

// AnimationType = "fadeInUp" | "fadeIn" | "slideInLeft" | "slideInRight" | "scaleIn"

export function AnimatedItem({
	children,
	animation = "fadeInUp",
	delay = 0,
	duration = 0.5,
	className,
	...props
}) {
	const { variants } = useAnimation();

	return (
		<motion.div
			variants={variants[animation]}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{
				duration,
				delay,
				ease: [0.25, 0.46, 0.45, 0.94],
			}}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function AnimatedContainer({
	children,
	stagger = false,
	className,
	...props
}) {
	const { variants } = useAnimation();

	return (
		<motion.div
			variants={stagger ? variants.staggerContainer : undefined}
			initial="initial"
			animate="animate"
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}
