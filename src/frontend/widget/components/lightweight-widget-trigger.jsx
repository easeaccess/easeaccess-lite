import { useEffect, useState } from "@wordpress/element";
import RenderIcon from "@/components/render-icon";
import { cn } from "@/lib/utils";

export default function LightweightWidgetTrigger({ svgSettings, onClick }) {
	const [hasActiveFeatures, setHasActiveFeatures] = useState(false);

	useEffect(() => {
		function refreshState() {
			try {
				const raw = localStorage.getItem(
					"accessibility-widget-active-features",
				);
				const arr = JSON.parse(raw || "[]");
				setHasActiveFeatures(Array.isArray(arr) && arr.length > 0);
			} catch {
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
	}, []);

	const buttonSizeClass =
		{
			sm: "zn:h-10 zn:!px-3 zn:text-xs",
			md: "zn:h-12 zn:!px-5 zn:text-sm",
			lg: "zn:h-14 zn:!px-6 zn:text-base",
		}[svgSettings?.size] || "zn:h-12 zn:px-4 zn:py-3 zn:text-sm";

	const buttonRadiusClass =
		{
			sm: "zn:rounded",
			md: "zn:rounded-xl",
			lg: "zn:rounded-full",
		}[svgSettings?.radius] || "zn:rounded";

	const activeBadge = hasActiveFeatures ? (
		<span
			className={cn(
				"zn:absolute zn:flex zn:items-center zn:justify-center zn:h-5 zn:w-5 zn:rounded-full zn:!bg-white zn:!text-primary-icon zn:!border zn:!border-primary-icon zn:text-[10px] zn:font-bold",
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
	) : null;

	if (
		svgSettings?.labelButtonActive &&
		!svgSettings?.selectedIcon &&
		!svgSettings?.customSvg
	) {
		return (
			<button
				type="button"
				onClick={onClick}
				aria-label={svgSettings?.buttonLabel || "Open accessibility options"}
				aria-haspopup="dialog"
				className={cn(
					"zn:relative zn:flex zn:items-center zn:justify-center zn:w-full zn:flex-1 zn:!bg-primary-icon zn:text-primary-icon-foreground zn:font-medium zn:transition-transform hover:zn:scale-105 focus-visible:zn:outline focus-visible:zn:outline-2 focus-visible:zn:outline-offset-2 focus-visible:zn:outline-primary-icon zn:!border-0",
					buttonSizeClass,
					buttonRadiusClass,
				)}
			>
				{svgSettings.buttonLabel || "Accessibility"}
				{activeBadge}
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Open accessibility options"
			aria-haspopup="dialog"
			className={cn(
				"zn:relative zn:cursor-pointer zn:text-white zn:flex zn:items-center zn:justify-center zn:!bg-primary-icon zn:transition-transform hover:zn:scale-105 focus-visible:zn:outline focus-visible:zn:outline-2 focus-visible:zn:outline-offset-2 focus-visible:zn:outline-primary-icon zn:!border-0 zn:!p-0",
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
			{activeBadge}
		</button>
	);
}
