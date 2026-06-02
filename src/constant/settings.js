/**
 * LITE build feature definitions — only free features.
 * No premium feature references, no upsell, no PRO badges.
 * This file replaces settings.js in lite builds via webpack alias.
 */
import {
	Contrast,
	Link2,
	Baseline,
	Bold,
	ALargeSmall,
	BetweenHorizontalStart,
	Space,
	AlignLeft,
	DropletOff,
	MousePointer2,
	ArrowUpToLine,
	Text,
} from "lucide-react";

export const DEFAULT_FEATURES = [
	{
		title: "Content Adjustments",
		infoTooltip: "Adjust how content is displayed.",
		settings: [
			{ label: "Readable Font", key: "readableFont", icon: Bold },
			{ label: "Highlight Titles", key: "highlightTitles", icon: Baseline },
			{ label: "Highlight Links", key: "highlightLinks", icon: Link2 },
			{ label: "Bigger Text", key: "adjustFontSizing", icon: ALargeSmall },
			{
				label: "Line Height",
				key: "adjustLineHeight",
				icon: BetweenHorizontalStart,
			},
			{
				label: "Letter Spacing",
				key: "adjustLetterSpacing",
				icon: Space,
			},
			{
				label: "Text Alignment",
				key: "contentAlignment",
				icon: AlignLeft,
			},
		],
	},
	{
		title: "Color Adjustments",
		infoTooltip: "Modify color schemes for better readability.",
		settings: [
			{ label: "Greyscale", key: "greyscale", icon: DropletOff },
			{ label: "Contrast", key: "contrast", icon: Contrast },
		],
	},
	{
		title: "Navigation Adjustments",
		infoTooltip: "Settings for navigation methods.",
		settings: [
			{ label: "Big Cursor", key: "bigCursor", icon: MousePointer2 },
		],
	},
	{
		title: "Orientation Adjustments",
		infoTooltip: "Adjust screen orientation and reading aids.",
		settings: [
			{ label: "Reading Guide", key: "readingGuide", icon: ArrowUpToLine },
		],
	},
];

export function enrichFeatures(remoteFeatures = []) {
	const flatRemoteMap = Object.fromEntries(
		remoteFeatures.flatMap((cat) =>
			cat.settings.map((setting) => [setting.key, setting]),
		),
	);

	return DEFAULT_FEATURES.map((category) => ({
		...category,
		settings: category.settings.map((setting) => {
			const remote = flatRemoteMap[setting.key] || {};
			return {
				...setting,
				enabled: remote.enabled ?? setting.enabled ?? true,
				premium: false,
			};
		}),
	}));
}
