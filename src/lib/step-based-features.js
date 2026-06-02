import {
	ALargeSmall,
	AlignCenter,
	AlignLeft,
	AlignRight,
	BetweenHorizonalStart,
	Droplet,
	DropletOff,
	Droplets,
	Moon,
	Sun,
	ZoomIn,
} from "lucide-react";

export const stepBasedFeatures = {
	contentScaling: {
		steps: 4,
		mode: "click",
		labels: [
			"Content Size 1.1x",
			"Content Size 1.2x",
			"Content Size 1.3x",
			"Content Size 1.4x",
		],
		icons: [ZoomIn, ZoomIn, ZoomIn, ZoomIn],
	},
	contrast: {
		steps: 3,
		mode: "click",
		labels: ["Dark Contrast", "Light Contrast", "High Contrast"],
		icons: [Sun, ZoomIn, Moon],
	},
	contentAlignment: {
		steps: 3,
		mode: "click",
		labels: ["Align Left", "Align Center", "Align Right"],
		icons: [AlignLeft, AlignCenter, AlignRight],
	},
	colorSaturation: {
		steps: 3,
		mode: "click",
		labels: ["Low Saturation", "High Saturation", "Desaturate"],
		icons: [Droplet, Droplets, DropletOff],
	},
	adjustLineHeight: {
		steps: 3,
		mode: "click",
		labels: ["Line Height 1.5x", "Line Height 1.75x", "Line Height 2x"],
		icons: [
			BetweenHorizonalStart,
			BetweenHorizonalStart,
			BetweenHorizonalStart,
		],
	},
	adjustLetterSpacing: {
		steps: 3,
		mode: "click",
		labels: ["Spacing 1.25x", "Spacing 1.5x", "Spacing 1.75x"],
	},
	adjustFontSizing: {
		steps: 3,
		mode: "click",
		labels: ["Text Size 1.25x", "Text Size 1.50x", "Text Size 1.75x"],
		icons: [ALargeSmall, ALargeSmall, ALargeSmall],
	},
	bigCursor: {
		steps: 3,
		mode: "click",
		labels: ["Cursor Small", "Cursor Medium", "Cursor Large"],
	},
	pointerTrail: {
		steps: 6,
		mode: "click",
		labels: ["Trail", "Neon", "Particle", "Rainbow", "Geometric", "Line"],
	},
};

export const stepLabels = {
	contentScaling: ["Zoom 1.1x", "Zoom 1.2x", "Zoom 1.3x", "Zoom 1.4x"],
	contrast: ["Default", "Bright", "Dark", "Reset"],
};
