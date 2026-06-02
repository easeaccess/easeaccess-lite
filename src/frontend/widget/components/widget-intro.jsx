import { useTranslation } from "@/hooks/use-translation";

export default function WidgetIntro({ svgSettings }) {
	const { __ } = useTranslation();
	const shortcut = svgSettings?.keyboardShortcut || "Alt+Shift+A";
	const theme = svgSettings?.containerTheme || "default";
	if (theme !== "classic") {
		return null;
	}

	return (
		<div className="zn:text-center zn:!mt-6 zn:!pb-6 zn:md:block zn:hidden">
			<div className="zn:font-semibold zn:!text-xl  zn:!mb-3">
				{__("Accessibility Adjustments", "easeaccess")}
			</div>
			<div className=" zn:font-normall zn:!text-sm zn:tracking-wide">
				{__(
					"Adjust accessibility settings to improve your experience",
					"easeaccess",
				)}
				{svgSettings.openKeyboardShortcuts && (
					<span className="zn:font-semibold">({shortcut})</span>
				)}
			</div>
		</div>
	);
}
