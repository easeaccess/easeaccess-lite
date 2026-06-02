"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function MotionTextLoader({
	text = "Loading",
	className,
	variant = "dots",
	speed = "normal",
}) {
	const [currentText, setCurrentText] = useState("");
	const [showCursor, setShowCursor] = useState(true);

	const speedConfig = {
		slow: { duration: 0.8, delay: 0.1 },
		normal: { duration: 0.6, delay: 0.08 },
		fast: { duration: 0.4, delay: 0.05 },
	};

	const config = speedConfig[speed];

	// Typing effect
	useEffect(() => {
		if (variant === "typing") {
			let index = 0;
			const interval = setInterval(() => {
				if (index <= text.length) {
					setCurrentText(text.slice(0, index));
					index++;
				} else {
					// Reset and start over
					index = 0;
					setCurrentText("");
				}
			}, config.duration * 100);

			return () => clearInterval(interval);
		}
	}, [text, variant, config.duration]);

	// Cursor blink effect
	useEffect(() => {
		if (variant === "typing") {
			const interval = setInterval(() => {
				setShowCursor((prev) => !prev);
			}, 500);
			return () => clearInterval(interval);
		}
	}, [variant]);

	if (variant === "dots") {
		return (
			<div
				className={cn(
					"zn:flex zn:items-center zn:gap-2 zn:text-muted-foreground",
					className,
				)}
			>
				<span className="zn:text-sm font-medium">{text}</span>
				<div className="zn:flex zn:gap-1">
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							className="zn:w-1.5 zn:h-1.5 zn:bg-primary zn:rounded-full"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								duration: config.duration,
								repeat: Number.POSITIVE_INFINITY,
								delay: i * config.delay,
								ease: "easeInOut",
							}}
							// Accessibility: Respect reduced motion preference
							style={{
								animationPlayState: "var(--animation-play-state, running)",
							}}
						/>
					))}
				</div>
			</div>
		);
	}

	if (variant === "typing") {
		return (
			<div
				className={cn(
					"zn:flex zn:items-center zn:text-muted-foreground",
					className,
				)}
			>
				<span className="zn:text-sm zn:font-medium zn:font-mono">
					{currentText}
					<motion.span
						className="zn:inline-block zn:w-0.5 zn:h-4 zn:bg-primary zn:ml-1"
						animate={{ opacity: showCursor ? 1 : 0 }}
						transition={{ duration: 0.1 }}
					/>
				</span>
			</div>
		);
	}

	if (variant === "fade") {
		return (
			<div className={cn("zn:text-muted-foreground", className)}>
				<AnimatePresence mode="wait">
					<motion.span
						key={text}
						className="zn:text-sm zn:font-medium"
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0.7, 1] }}
						transition={{
							duration: config.duration * 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					>
						{text}
					</motion.span>
				</AnimatePresence>
			</div>
		);
	}

	if (variant === "slide") {
		return (
			<div
				className={cn("zn:overflow-hidden zn:text-muted-foreground", className)}
			>
				<motion.div
					className="zn:text-sm zn:font-medium"
					animate={{
						x: ["-100%", "0%", "0%", "100%"],
					}}
					transition={{
						duration: config.duration * 3,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						times: [0, 0.3, 0.7, 1],
					}}
				>
					{text}
				</motion.div>
			</div>
		);
	}

	return null;
}
