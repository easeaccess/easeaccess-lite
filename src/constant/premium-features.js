/**
 * EaseAccess Lite — advertises which features are available in the separate
 * EaseAccess Pro plugin. This is informational only ("point out which features
 * are available through a separated plugin"): NO Pro functionality ships in
 * Lite, no license is checked, and none of these keys are wired to any handler.
 */
import {
	Volume2,
	Scan,
	MousePointer2,
	Languages,
	BookOpen,
	Keyboard,
	MousePointerClick,
	ZoomIn,
	MessageSquare,
	Palette,
	LayoutList,
	Sparkles,
	Images,
} from "lucide-react";

// Pro feature key -> human label.
export const PREMIUM_FEATURES_MAP = {
	// General settings teasers
	sheetSidebar: "Sheet Sidebar",
	accessibilityProfile: "Accessibility Profile",
	openKeyboardShortcuts: "Custom Keyboard Shortcuts",
	// Widget feature teasers
	screenReader: "Screen Reader",
	pageReader: "Page Reader",
	quickTranslate: "Quick Translate",
	readingMask: "Reading Mask",
	pointerTrail: "Pointer Trail",
	outlineFocus: "Keyboard Navigation",
	highlightHover: "Highlight on Hover",
	magnifiImages: "Magnify Images",
	tooltips: "Tooltips",
	colorSaturation: "Color Saturation",
	pageStructure: "Page Structure",
	clickSpark: "Click Spark",
	imageTrails: "Image Trails",
};

export const PREMIUM_FEATURE_KEYS = Object.keys(PREMIUM_FEATURES_MAP);
export const PREMIUM_FEATURE_LABELS = Object.values(PREMIUM_FEATURES_MAP);
export const isPremiumFeature = (key) => PREMIUM_FEATURE_KEYS.includes(key);
export const getPremiumLabel = (key) => PREMIUM_FEATURES_MAP[key] || key;

// Display list (with icons) for the "Available in EaseAccess Pro" admin teaser
// shown on the Features page. The three general-settings teasers are rendered
// separately on the General page, so they are not repeated here.
export const PRO_FEATURES = [
	{ key: "screenReader", label: "Screen Reader", icon: Volume2 },
	{ key: "pageReader", label: "Page Reader", icon: BookOpen },
	{ key: "quickTranslate", label: "Quick Translate", icon: Languages },
	{ key: "readingMask", label: "Reading Mask", icon: Scan },
	{ key: "pointerTrail", label: "Pointer Trail", icon: MousePointer2 },
	{ key: "outlineFocus", label: "Keyboard Navigation", icon: Keyboard },
	{ key: "highlightHover", label: "Highlight on Hover", icon: MousePointerClick },
	{ key: "magnifiImages", label: "Magnify Images", icon: ZoomIn },
	{ key: "tooltips", label: "Tooltips", icon: MessageSquare },
	{ key: "colorSaturation", label: "Color Saturation", icon: Palette },
	{ key: "pageStructure", label: "Page Structure", icon: LayoutList },
	{ key: "clickSpark", label: "Click Spark", icon: Sparkles },
	{ key: "imageTrails", label: "Image Trails", icon: Images },
];
