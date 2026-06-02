import { Button } from "@/components/ui/button";
import { cn } from "../../../lib/utils";
import RenderIcon from "@/components/render-icon";
const FloatingButton = ({ svgSettings, device }) => {
	const sizeClass = {
		sm: "zn:h-10 zn:w-10",
		md: "zn:h-12 zn:w-12",
		lg: "zn:h-16 zn:w-16",
	}[svgSettings.size];

	const innerSizeClass = {
		sm: "zn:h-8 zn:w-8",
		md: "zn:h-10 zn:w-10",
		lg: "zn:h-14 zn:w-14",
	}[svgSettings.size];

	const radiusClass = {
		sm: "zn:rounded",
		md: "zn:rounded-xl",
		lg: "zn:rounded-full",
	}[svgSettings.radius];

	const positionKey =
		device === "mobile"
			? svgSettings.buttonPositionMobile
			: svgSettings.buttonPosition;

	const positionMap = {
		"bottom-right": "zn:bottom-6 zn:end-6",
		"bottom-left": "zn:bottom-6 zn:start-6",
		"top-right": "zn:top-6 zn:end-6",
		"top-left": "zn:top-6 zn:start-6",
		"center-right": "zn:top-1/2 zn:-translate-y-1/2 zn:end-6",
		"center-left": "zn:top-1/2 zn:-translate-y-1/2 zn:start-6",
		"top-center": "zn:top-6 zn:-translate-x-1/2 zn:start-1/2",
		"bottom-center": "zn:bottom-6 zn:-translate-x-1/2 zn:start-1/2",
	};

	// Button size and text size mappings for label buttons
	const buttonSizeClass = {
		sm: "zn:h-10 zn:px-3  zn:text-xs",
		md: "zn:h-12 zn:px-5 zn:text-sm",
		lg: "zn:h-14 zn:px-6  zn:text-base",
	}[svgSettings.size];

	return svgSettings.labelButtonActive &&
		!svgSettings.selectedIcon &&
		!svgSettings.customSvg ? (
		<div
			className={cn(
				"zn:absolute zn:text-white zn:flex zn:items-center zn:justify-center ",
				positionMap[positionKey],
			)}
		>
			<Button
				className={cn(
					"zn:bg-primary-icon zn:text-primary-icon-foreground zn:font-medium zn:transition-colors zn:hover:opacity-90",
					buttonSizeClass,
					radiusClass,
				)}
			>
				{svgSettings.buttonLabel || "Accessibility"}
			</Button>
		</div>
	) : (
		<div
			className={cn(
				"zn:absolute zn:text-white zn:flex zn:items-center zn:justify-center zn:bg-primary-icon",
				sizeClass,
				radiusClass,
				positionMap[positionKey],
			)}
		>
			<div
				className={cn(
					"zn:absolute zn:border-2 zn:border-primary-icon-foreground zn:bg-primary-icon",
					innerSizeClass,
					radiusClass,
				)}
			/>
			<RenderIcon svgSettings={svgSettings} />
		</div>
	);
};

export default FloatingButton;
