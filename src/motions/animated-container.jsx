"use client";

import { motion } from "framer-motion";
import { useAnimation } from "@/context/animation-provider";

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
