import { cn, getContrastTextColor, processSvgForColoring } from "@/lib/utils";
import { predefinedIcons } from "@/constant/data";
import { useMemo } from "@wordpress/element";

/**
 * Unified renderer for accessibility widget/admin icon preview.
 * Accepts svgSettings object and returns appropriate JSX.
 */
export default function RenderIcon({ svgSettings, className = "" }) {
	if (!svgSettings) return null;
	const sizeClass = {
		sm: "zn:size-[20px]",
		md: "zn:size-[24px]",
		lg: "zn:size-[32px]",
	}[svgSettings.size || "sm"];

	const processed = useMemo(() => {
		if (svgSettings?.customSvg) {
			// Use existing processedSvg if provided, else process on the fly
			if (svgSettings.processedSvg) return svgSettings.processedSvg;
			try {
				const pixelSize =
					svgSettings.size === "lg" ? 32 : svgSettings.size === "md" ? 24 : 20;
				return processSvgForColoring(
					svgSettings.customSvg,
					svgSettings?.bgColor?.color || "#2563eb",
					pixelSize,
				);
			} catch {
				return null;
			}
		}
		return null;
	}, [
		svgSettings?.customSvg,
		svgSettings?.processedSvg,
		svgSettings?.bgColor?.color,
		svgSettings?.size,
	]);

	if (processed) {
		return (
			<div
				className={cn(
					"zn:flex zn:items-center zn:justify-center zn:z-10",
					sizeClass,
					className,
				)}
				style={{
					color: getContrastTextColor(svgSettings?.bgColor?.color || "#2563eb"),
				}}
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: processed }}
			/>
		);
	}
	if (svgSettings?.selectedIcon) {
		const selected = predefinedIcons.find(
			(icon) => icon.name === svgSettings.selectedIcon,
		);
		const SelectedIconComponent = selected?.icon;
		if (SelectedIconComponent && typeof SelectedIconComponent === "function") {
			return (
				<SelectedIconComponent
					className={cn(
						"zn:flex zn:items-center zn:justify-center zn:z-10",
						sizeClass,
						className,
					)}
					style={{
						color: getContrastTextColor(
							svgSettings?.bgColor?.color || "#2563eb",
						),
					}}
				/>
			);
		}
	}
	return null;
}
