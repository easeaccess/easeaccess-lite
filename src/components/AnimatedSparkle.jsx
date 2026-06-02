import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function AnimatedSparkle({ className, ...props }) {
	return (
		<motion.span
			className={cn("zn:relative zn:overflow-hidden")}
			animate={{
				rotate: [0, 360],
			}}
			transition={{
				duration: 8,
				repeat: Number.POSITIVE_INFINITY,
				ease: "linear",
			}}
		>
			<motion.svg
				xmlns="http://www.w3.org/2000/svg"
				width="80"
				height="84"
				className={className}
				{...props}
				viewBox="0 0 20 21"
				fill="none"
				animate={{
					scale: [1, 1.2, 1],
					filter: [
						"drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
						"drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))",
						"drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))",
					],
				}}
				transition={{
					duration: 2,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			>
				{/* Main large star */}
				<motion.path
					d="M19.0812 9.88522L14.1373 8.05522L12.2912 2.00466C12.2201 1.77133 12.004 1.61133 11.7601 1.61133C11.5162 1.61133 11.3001 1.77133 11.2289 2.00466L9.38339 8.05522L4.43895 9.88522C4.22062 9.96633 4.07617 10.1736 4.07617 10.4063C4.07617 10.6386 4.22062 10.8469 4.43895 10.9274L9.38062 12.7569L11.2273 18.9919C11.2973 19.2274 11.5139 19.3891 11.7601 19.3891C12.0056 19.3891 12.2228 19.2274 12.2928 18.9913L14.1395 12.7563L19.0817 10.9269C19.2989 10.8469 19.4439 10.6391 19.4439 10.4063C19.4439 10.1741 19.2989 9.96633 19.0812 9.88522Z"
					fill="white"
					animate={{
						fill: ["#ffffff", "#ffd700", "#ffffff", "#87ceeb", "#ffffff"],
					}}
					transition={{
						duration: 3,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>

				{/* Medium star */}
				<motion.path
					d="M7.97066 15.9966L6.68511 15.5211L6.18511 13.6877C6.11955 13.4455 5.90011 13.2777 5.64955 13.2777C5.399 13.2777 5.17955 13.4455 5.11344 13.6872L4.61344 15.5205L3.32844 15.9961C3.11011 16.0766 2.96566 16.2849 2.96566 16.5172C2.96566 16.7494 3.11011 16.9577 3.32844 17.0383L4.60677 17.5122L5.11066 19.5244C5.17289 19.7711 5.39455 19.9444 5.64955 19.9444C5.90455 19.9444 6.12622 19.7711 6.18844 19.5238L6.69233 17.5116L7.97066 17.0377C8.189 16.9577 8.33344 16.7494 8.33344 16.5172C8.33344 16.2849 8.189 16.0766 7.97066 15.9966Z"
					fill="white"
					animate={{
						fill: ["#ffffff", "#ff69b4", "#ffffff", "#00ff7f", "#ffffff"],
						scale: [1, 1.3, 1],
					}}
					transition={{
						duration: 2.5,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 0.5,
					}}
				/>

				{/* Small star */}
				<motion.path
					d="M5.56066 3.96161L4.24733 3.47549L3.76066 2.16161C3.68011 1.94327 3.47233 1.79883 3.23955 1.79883C3.00733 1.79883 2.79955 1.94327 2.71844 2.16161L2.23233 3.47549L0.918442 3.96161C0.700108 4.04272 0.555664 4.2505 0.555664 4.48272C0.555664 4.71494 0.700108 4.92327 0.918442 5.00383L2.23233 5.48994L2.71844 6.80383C2.79955 7.02216 3.00733 7.16661 3.23955 7.16661C3.47177 7.16661 3.67955 7.02216 3.76066 6.80383L4.24677 5.48994L5.56066 5.00383C5.779 4.92272 5.92344 4.71494 5.92344 4.48272C5.92344 4.2505 5.779 4.04272 5.56066 3.96161Z"
					fill="white"
					animate={{
						fill: ["#ffffff", "#ff4500", "#ffffff", "#9370db", "#ffffff"],
						scale: [1, 1.5, 1],
					}}
					transition={{
						duration: 2,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 1,
					}}
				/>
			</motion.svg>

			{/* Floating sparkle particles */}
			{[...Array(6)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute w-2 h-2 bg-white rounded-full"
					style={{
						top: `${20 + i * 10}%`,
						left: `${30 + i * 15}%`,
					}}
					animate={{
						y: [-10, -30, -10],
						x: [-5, 5, -5],
						opacity: [0, 1, 0],
						scale: [0, 1, 0],
					}}
					transition={{
						duration: 3,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: i * 0.3,
					}}
				/>
			))}
		</motion.span>
	);
}
