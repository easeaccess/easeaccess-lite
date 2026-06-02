import { cn } from "@/lib/utils";
import RenderIcon from "@/components/render-icon";
import { motion } from "motion/react";
import { useEffect, useState } from "@wordpress/element";

/**
 * Unified widget trigger button.
 * Shows either a text label button or an icon circle depending on settings.
 */
export default function WidgetTrigger({ svgSettings }) {
	const [hasActiveFeatures, setHasActiveFeatures] = useState(false);

	useEffect(() => {
		function refreshState() {
			try {
				const raw = localStorage.getItem(
					"accessibility-widget-active-features",
				);
				const arr = JSON.parse(raw || "[]");
				setHasActiveFeatures(Array.isArray(arr) && arr.length > 0);
			} catch (e) {
				setHasActiveFeatures(false);
			}
		}
		refreshState();
		window.addEventListener("accessibility-features-changed", refreshState);
		return () => {
			window.removeEventListener(
				"accessibility-features-changed",
				refreshState,
			);
		};
	}, [svgSettings]);
	// Button size mappings for label buttons
	const buttonSizeClass =
		{
			sm: "zn:h-10 zn:!px-3  zn:text-xs",
			md: "zn:h-12 zn:!px-5 zn:text-sm",
			lg: "zn:h-14 zn:!px-6 zn:text-base",
		}[svgSettings?.size] || "zn:h-12 zn:px-4 zn:py-3 zn:text-sm";

	// Button radius mappings for label buttons
	const buttonRadiusClass =
		{
			sm: "zn:rounded",
			md: "zn:rounded-xl",
			lg: "zn:rounded-full",
		}[svgSettings?.radius] || "zn:rounded";

	if (
		svgSettings?.labelButtonActive &&
		!svgSettings?.selectedIcon &&
		!svgSettings?.customSvg
	) {
		return (
			<motion.span
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				transition={{ type: "spring", stiffness: 400, damping: 18 }}
				role="button"
				tabIndex={0}
				aria-label={svgSettings?.buttonLabel || "Open accessibility options"}
				className={cn(
					"zn:relative zn:flex zn:items-center zn:justify-center zn:w-full zn:flex-1 zn:!bg-primary-icon zn:text-primary-icon-foreground zn:font-medium zn:transition-colors zn:cursor-pointer focus-visible:zn:outline focus-visible:zn:outline-2 focus-visible:zn:outline-offset-2 focus-visible:zn:outline-primary-icon",
					buttonSizeClass,
					buttonRadiusClass,
				)}
			>
				{svgSettings.buttonLabel || "Accessibility"}
				{hasActiveFeatures && (
					<span
						className={cn(
							"zn:absolute  zn:flex zn:items-center zn:justify-center zn:h-5 zn:w-5 zn:rounded-full zn:!bg-white zn:!text-primary-icon zn:!border zn:!border-primary-icon zn:text-[10px] zn:font-bold",
							{
								"zn:-top-1 zn:-end-1": svgSettings?.radius !== "lg",
								"zn:top-0 zn:-end-0": svgSettings?.radius === "lg",
							},
						)}
						aria-hidden="true"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6.5 10.5L3.75 7.75L2.667 8.833L6.5 12.667L13.5 5.667L12.417 4.583L6.5 10.5Z"
								fill="currentColor"
							/>
						</svg>
					</span>
				)}
			</motion.span>
		);
	}

	return (
		<motion.div
			whileHover={{ scale: 1.15 }}
			whileTap={{ scale: 0.9 }}
			transition={{ type: "spring", stiffness: 400, damping: 18 }}
			role="button"
			tabIndex={0}
			aria-label="Open accessibility options"
			className={cn(
				"zn:relative zn:cursor-pointer zn:text-white zn:flex zn:items-center zn:justify-center zn:!bg-primary-icon focus-visible:zn:outline focus-visible:zn:outline-2 focus-visible:zn:outline-offset-2 focus-visible:zn:outline-primary-icon",
				{
					"zn:h-10 zn:w-10": svgSettings?.size === "sm",
					"zn:h-12 zn:w-12": svgSettings?.size === "md",
					"zn:h-16 zn:w-16": svgSettings?.size === "lg",
					"zn:rounded": svgSettings?.radius === "sm",
					"zn:rounded-xl": svgSettings?.radius === "md",
					"zn:rounded-full": svgSettings?.radius === "lg",
				},
			)}
		>
			<div
				className={cn(
					"zn:absolute zn:rounded-full zn:!border-2 zn:!border-primary-icon-foreground zn:!bg-primary-icon",
					{
						"zn:h-8 zn:w-8": svgSettings?.size === "sm",
						"zn:h-10 zn:w-10": svgSettings?.size === "md",
						"zn:h-14 zn:w-14": svgSettings?.size === "lg",
						"zn:rounded": svgSettings?.radius === "sm",
						"zn:rounded-xl": svgSettings?.radius === "md",
						"zn:rounded-full": svgSettings?.radius === "lg",
					},
				)}
			/>
			<RenderIcon svgSettings={svgSettings} className="zn:relative zn:z-10" />
			{hasActiveFeatures && (
				<span
					className={cn(
						"zn:absolute  zn:flex zn:items-center zn:justify-center zn:h-5 zn:w-5 zn:rounded-full zn:!bg-white zn:!text-primary-icon zn:!border zn:!border-primary-icon zn:text-[10px] zn:font-bold",
						{
							"zn:-top-1 zn:-end-1": svgSettings?.radius !== "lg",
							"zn:top-0 zn:-end-0": svgSettings?.radius === "lg",
						},
					)}
					aria-hidden="true"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.5 10.5L3.75 7.75L2.667 8.833L6.5 12.667L13.5 5.667L12.417 4.583L6.5 10.5Z"
							fill="currentColor"
						/>
					</svg>
				</span>
			)}
		</motion.div>
	);
}
