/**
 * EaseAccess Lite — advertises which features are available in the separate
 * EaseAccess Pro plugin. Informational only ("point out which features are
 * available through a separated plugin"): NO Pro functionality ships in Lite,
 * no license is checked, and none of these keys are wired to any handler.
 *
 * Keys/labels mirror EaseAccess Pro so the menu reads identically.
 */
export const PREMIUM_FEATURES_MAP = {
	// General settings teasers
	sheetSidebar: "Sheet Sidebar",
	accessibilityProfile: "Accessibility Profile",
	openKeyboardShortcuts: "Custom Keyboard Shortcuts",
	// Content Adjustments
	contentScaling: "Content Scaling",
	dyslexiaFriendly: "Dyslexia Friendly",
	dictionary: "Dictionary",
	quickTranslate: "Translator",
	// Color Adjustments
	colorSaturation: "Color Saturation",
	// Navigation Adjustments
	pageStructure: "Page Structure",
	pointerTrail: "Pointer Trail",
	clickSpark: "Click Spark",
	imageTrails: "Image Trails",
	// Orientation Adjustments
	pageReader: "Page Reader",
	screenReader: "Screen reader",
	readingMask: "Reading mask",
	pauseAnimations: "Pause animations",
	hideImages: "Hide images",
	outlineFocus: "Keyboard Navigation",
	landmarkHotkeys: "Landmark Hotkeys",
	voiceCommands: "Voice Commands",
	highlightHover: "Highlight Hover",
	magnifiImages: "Magnify Images",
	tooltips: "Tooltips",
};

export const PREMIUM_FEATURE_KEYS = Object.keys(PREMIUM_FEATURES_MAP);
export const PREMIUM_FEATURE_LABELS = Object.values(PREMIUM_FEATURES_MAP);
export const isPremiumFeature = (key) => key in PREMIUM_FEATURES_MAP;
export const getPremiumLabel = (key) => PREMIUM_FEATURES_MAP[key] || key;
