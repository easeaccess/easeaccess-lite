import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Accessibility } from "@/icons";
import PreviewBox from "@/components/preview-box";
import DefaultSidebarTheme from "@/images/sidebar-theme/default.svg";
import ClassicSidebarTheme from "@/images/sidebar-theme/classic.svg";

export default function AnimatedPreview({
	enableWidget,
	displayContainerMode,
	containerTheme,
}) {
	// Animation state for the preview
	const [isAnimating, setIsAnimating] = useState(false);
	const [showCursor, setShowCursor] = useState(false);
	const [showContainer, setShowContainer] = useState(false);

	// Animation cycle effect
	useEffect(() => {
		if (!enableWidget) {
			setIsAnimating(false);
			setShowCursor(false);
			setShowContainer(false);
			return;
		}

		const animationCycle = () => {
			// Step 1: Show cursor moving to icon
			setShowCursor(true);
			setIsAnimating(true);

			setTimeout(() => {
				// Step 2: Show container opening (after cursor reaches icon)
				setShowContainer(true);
			}, 1300);

			setTimeout(() => {
				// Step 3: Hide container (let it stay visible longer)
				setShowContainer(false);
			}, 3800);

			setTimeout(() => {
				// Step 4: Hide cursor and reset
				setShowCursor(false);
				setIsAnimating(false);
			}, 4200);
		};

		// Start initial animation after a short delay
		const initialTimer = setTimeout(animationCycle, 500);

		// Repeat animation every 7 seconds
		const interval = setInterval(animationCycle, 7000);

		return () => {
			clearTimeout(initialTimer);
			clearInterval(interval);
		};
	}, [enableWidget, displayContainerMode, containerTheme]);

	return (
		<PreviewBox className="zn:h-[345px] zn:relative zn:overflow-hidden">
			{/* Animated Cursor */}
			<AnimatePresence>
				{showCursor && enableWidget && (
					<motion.div
						initial={{ opacity: 0, x: 80, y: 80 }}
						animate={{
							opacity: 1,
							x: [80, 40, 15],
							y: [80, 40, 15],
						}}
						exit={{ opacity: 0, scale: 0.8 }}
						transition={{
							duration: 1.2,
							ease: "easeInOut",
							x: { times: [0, 0.6, 1], ease: "easeOut" },
							y: { times: [0, 0.6, 1], ease: "easeOut" },
						}}
						className="zn:absolute zn:bottom-2 zn:end-2 zn:pointer-events-none zn:z-50"
					>
						<div className="zn:relative">
							{/* Custom SVG Cursor */}
							<motion.div
								animate={{
									scale: showCursor ? [1, 1.1, 1] : 1,
								}}
								transition={{
									duration: 0.3,
									delay: 1.0,
									ease: "easeInOut",
								}}
								className="zn:w-6 zn:h-6"
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="zn:w-full zn:h-full zn:drop-shadow-lg"
								>
									<path
										d="M17.0812 9.0375C16.4391 9.0375 15.9188 9.55781 15.9188 10.2V8.92969C15.9188 8.2875 15.3984 7.76719 14.7562 7.76719C14.1141 7.76719 13.5938 8.2875 13.5938 8.92969V7.78594C13.5938 7.14375 13.0734 6.62344 12.4313 6.62344C11.7891 6.62344 11.2687 7.14375 11.2687 7.78594V3.43594C11.2687 2.79375 10.7484 2.27344 10.1063 2.27344C9.46406 2.27344 8.94375 2.79375 8.94375 3.43594V11.1562V11.8031L7.64062 10.5C7.18594 10.0453 6.45 10.0453 5.99531 10.5C5.54062 10.9547 5.54062 11.6906 5.99531 12.1453L9.34219 15.9328C9.75 16.3969 9.97969 16.9922 9.97969 17.6109V18.3422H16.9594V17.1234C16.9594 16.8094 17.0156 16.5 17.1281 16.2094L18.0797 13.7437C18.1922 13.4531 18.2484 13.1437 18.2484 12.8297V11.1469V10.1953C18.2484 9.55781 17.7234 9.0375 17.0812 9.0375Z"
										fill="white"
									/>
									<path
										d="M9.88555 17.9199H17.0762C17.7793 17.9199 18.3465 18.4871 18.3465 19.1902V20.4605C18.3465 21.1637 17.7793 21.7309 17.0762 21.7309H9.88555C9.18242 21.7309 8.61523 21.1637 8.61523 20.4605V19.1902C8.61523 18.4871 9.18242 17.9199 9.88555 17.9199Z"
										fill="#111927"
									/>
									<path
										d="M17.4235 17.4891V17.1281C17.4235 16.8703 17.4703 16.6219 17.5641 16.3828L18.5156 13.9172C18.6516 13.5703 18.7172 13.2047 18.7172 12.8344V10.2C18.7172 9.3 17.986 8.56875 17.086 8.56875C16.8328 8.56875 16.5938 8.625 16.3781 8.72813C16.2797 7.92188 15.5906 7.29844 14.7563 7.29844C14.4938 7.29844 14.25 7.35938 14.0297 7.46719C13.8797 6.72188 13.2188 6.15469 12.4313 6.15469C12.1828 6.15469 11.9485 6.21094 11.7375 6.30938V3.43594C11.7375 2.53594 11.0063 1.80469 10.1063 1.80469C9.20626 1.80469 8.47501 2.53594 8.47501 3.43594V10.6688L7.97814 10.1719C7.66876 9.8625 7.26095 9.69375 6.82501 9.69375C6.38908 9.69375 5.98126 9.8625 5.67189 10.1719C5.03908 10.8047 5.03439 11.8313 5.66251 12.4688L9.00001 16.2469C9.30939 16.5984 9.48751 17.0344 9.51564 17.4984C8.7422 17.6719 8.16095 18.3656 8.16095 19.1953V20.4656C8.16095 21.4219 8.93908 22.2047 9.90001 22.2047H17.0906C18.0469 22.2047 18.8297 21.4266 18.8297 20.4656V19.1953C18.811 18.3516 18.2156 17.6484 17.4235 17.4891ZM9.3422 15.9328L6.00001 12.1453C5.54533 11.6906 5.54533 10.9547 6.00001 10.5C6.4547 10.0453 7.19064 10.0453 7.64533 10.5L8.94376 11.7984V3.43594C8.94376 2.79375 9.46408 2.27344 10.1063 2.27344C10.7485 2.27344 11.2688 2.79375 11.2688 3.43594V10.5C11.2688 10.6313 11.3719 10.7344 11.5031 10.7344C11.6344 10.7344 11.7375 10.6313 11.7375 10.5V6.8625C11.9297 6.71719 12.1735 6.63281 12.4313 6.63281C13.0735 6.63281 13.5938 7.15313 13.5938 7.79531V10.9359C13.5938 11.0578 13.6922 11.1563 13.8141 11.1563H13.8422C13.9641 11.1563 14.0625 11.0578 14.0625 10.9359V8.00156C14.2547 7.85625 14.4985 7.77188 14.7563 7.77188C15.3985 7.77188 15.9188 8.29219 15.9188 8.93438V11.3438C15.9188 11.475 16.0219 11.5781 16.1531 11.5781C16.2844 11.5781 16.3875 11.475 16.3875 11.3438V9.27188C16.5797 9.12656 16.8235 9.04219 17.0813 9.04219C17.7235 9.04219 18.2438 9.5625 18.2438 10.2047V12.8344C18.2438 13.1484 18.1875 13.4578 18.075 13.7484L17.1235 16.2141C17.011 16.5047 16.9547 16.8141 16.9547 17.1281V17.4563H9.97033C9.93283 16.8938 9.71251 16.3547 9.3422 15.9328ZM18.3422 20.4609C18.3422 21.1641 17.775 21.7313 17.0719 21.7313H9.88595C9.18751 21.7313 8.61564 21.1641 8.61564 20.4609V19.1906C8.61564 18.4875 9.18283 17.9203 9.88595 17.9203H17.0766C17.7797 17.9203 18.3469 18.4875 18.3469 19.1906L18.3422 20.4609Z"
										fill="#111927"
										stroke="#111927"
										strokeWidth="0.2"
									/>
								</svg>
							</motion.div>

							{/* Enhanced Click ripple effect */}
							<motion.div
								initial={{ scale: 0, opacity: 0 }}
								animate={{
									scale: [0, 2, 2.5],
									opacity: [0, 0.4, 0],
								}}
								transition={{
									duration: 0.8,
									delay: 1.1,
									ease: "easeOut",
								}}
								className="zn:absolute zn:top-1/2 zn:left-1/2 zn:w-12 zn:h-12 zn:bg-primary zn:rounded-full zn:-translate-x-1/2 zn:-translate-y-1/2"
							/>

							{/* Secondary ripple */}
							<motion.div
								initial={{ scale: 0, opacity: 0 }}
								animate={{
									scale: [0, 1.5, 2],
									opacity: [0, 0.2, 0],
								}}
								transition={{
									duration: 0.6,
									delay: 1.2,
									ease: "easeOut",
								}}
								className="zn:absolute zn:top-1/2 zn:left-1/2 zn:w-8 zn:h-8 zn:bg-blue-400 zn:rounded-full zn:-translate-x-1/2 zn:-translate-y-1/2"
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Container Preview - Smooth animations */}
			<motion.div
				className="zn:h-[calc(100%-80px)] zn:absolute zn:bottom-14 zn:end-3"
				initial={{ opacity: 0, scale: 0.85 }}
				animate={{
					opacity: showContainer ? 1 : 0,
					scale: showContainer ? 1 : 0.85,
				}}
				transition={{
					duration: 0.6,
					type: displayContainerMode === "popover" ? "spring" : "tween",
					bounce: displayContainerMode === "popover" ? 0.25 : 0,
					ease:
						displayContainerMode === "sheet" ? [0.25, 0.8, 0.25, 1] : "easeOut",
				}}
			>
				<motion.img
					className="zn:w-full zn:h-full zn:object-cover zn:shadow-lg zn:rounded-lg"
					src={
						containerTheme === "default"
							? DefaultSidebarTheme
							: ClassicSidebarTheme
					}
					alt={`${containerTheme} ${displayContainerMode} Theme`}
					initial={{
						x: displayContainerMode === "sheet" ? 120 : 0,
						y: displayContainerMode === "popover" ? 30 : 0,
						rotate: displayContainerMode === "popover" ? 2 : 0,
					}}
					animate={{
						x: showContainer ? 0 : displayContainerMode === "sheet" ? 120 : 0,
						y: showContainer ? 0 : displayContainerMode === "popover" ? 30 : 0,
						rotate: showContainer
							? 0
							: displayContainerMode === "popover"
							? 2
							: 0,
					}}
					transition={{
						duration: 0.7,
						ease:
							displayContainerMode === "sheet"
								? [0.25, 0.8, 0.25, 1]
								: [0.34, 1.56, 0.64, 1],
						delay: 0.1,
					}}
				/>
			</motion.div>

			{/* Accessibility Widget Icon */}
			{enableWidget && (
				<motion.div
					className="zn:absolute zn:text-white zn:flex zn:items-center zn:justify-center zn:bg-primary-icon zn:h-12 zn:w-12 zn:rounded-full zn:bottom-0 zn:end-3 zn:cursor-pointer zn:shadow-lg"
					whileHover={{
						scale: 1.05,
						boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
					}}
					whileTap={{ scale: 0.95 }}
					animate={{
						scale: isAnimating ? [1, 1.15, 1.05, 1] : 1,
						boxShadow: isAnimating
							? [
									"0 4px 15px rgba(59, 130, 246, 0.2)",
									"0 0 0 8px rgba(59, 130, 246, 0.3)",
									"0 0 0 16px rgba(59, 130, 246, 0.1)",
									"0 0 0 0 rgba(59, 130, 246, 0)",
							  ]
							: "0 4px 15px rgba(59, 130, 246, 0.2)",
					}}
					transition={{
						duration: 1.0,
						ease: "easeInOut",
						repeat: showCursor ? 1 : 0,
						boxShadow: {
							duration: 1.2,
							ease: "easeOut",
						},
					}}
				>
					<motion.div
						className="zn:absolute zn:border-2 zn:text-primary-icon-foreground zn:border-primary-icon-foreground zn:bg-primary-icon zn:h-10 zn:w-10 zn:rounded-full zn:flex zn:items-center zn:justify-center"
						animate={{
							rotate: isAnimating ? [0, 8, -8, 4, 0] : 0,
						}}
						transition={{
							duration: 0.8,
							delay: 1.0,
							ease: "easeInOut",
						}}
					>
						<motion.div
							animate={{
								scale: isAnimating ? [1, 1.1, 1] : 1,
							}}
							transition={{
								duration: 0.4,
								delay: 1.1,
								ease: "easeOut",
							}}
						>
							<Accessibility />
						</motion.div>
					</motion.div>
				</motion.div>
			)}

			{/* Animation Status Indicator */}
			{/* {enableWidget && (
				<div className="zn:absolute zn:top-2 zn:left-2 zn:text-xs zn:text-gray-500 zn:bg-white zn:px-2 zn:py-1 zn:rounded zn:shadow-sm">
					{isAnimating ? "Animating..." : "Preview"}
				</div>
			)} */}
		</PreviewBox>
	);
}
