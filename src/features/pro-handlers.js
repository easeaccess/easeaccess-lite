/**
 * Pro feature handlers — this file is EXCLUDED from lite builds.
 * All pro-only feature logic lives here.
 */
import {
	speak,
	stopSpeaking,
	handleTextSelection,
	enableScreenReader,
	disableScreenReader,
	enableKeyboardNav,
	disableKeyboardNav,
	enablePageReader,
	disablePageReader,
	enableQuickTranslate,
	disableQuickTranslate,
	enableTooltips,
	disableTooltips,
	enableHighlightHover,
	disableHighlightHover,
	enableMagnifiImages,
	disableMagnifiImages,
	enablePointerTrail,
	disablePointerTrail,
	applyPointerTrailVariant,
	getPointerTrailVariant,
	applyBigCursorStyle,
	applyColorSaturation,
	applyBodyZoom,
	scanPageStructure,
	createReadingMask,
	removeReadingMask,
} from "@/lib/feature-style";

// Helper — imported by use-feayure-toggle
export { scanPageStructure, createReadingMask, removeReadingMask };
export {
	enablePointerTrail,
	disablePointerTrail,
	applyPointerTrailVariant,
	getPointerTrailVariant,
	applyBigCursorStyle,
	applyColorSaturation,
	applyBodyZoom,
};
export {
	enableScreenReader,
	disableScreenReader,
	enableKeyboardNav,
	disableKeyboardNav,
	enablePageReader,
	disablePageReader,
	enableQuickTranslate,
	disableQuickTranslate,
	enableTooltips,
	disableTooltips,
	enableHighlightHover,
	disableHighlightHover,
	enableMagnifiImages,
	disableMagnifiImages,
};

/**
 * Build the pro portion of featureConfig.
 * Merged into the full config by use-feayure-toggle.
 */
export function getProFeatureConfig(helpers) {
	const { getActiveFeatures, saveActiveFeatures } = helpers;

	return {
		screenReader: {
			type: "js",
			key: "screenReader",
			handler: () => {
				const isActive = getActiveFeatures().includes("screenReader");
				if (isActive) {
					disableScreenReader();
					speak("Screen reader deactivated");
					saveActiveFeatures(
						getActiveFeatures().filter((f) => f !== "screenReader"),
					);
				} else {
					enableScreenReader();
					stopSpeaking();
					speak("Screen reader active");
					saveActiveFeatures([...getActiveFeatures(), "screenReader"]);
				}
			},
		},

		quickTranslate: {
			type: "js",
			key: "quickTranslate",
			handler: () => {
				const isActive = getActiveFeatures().includes("quickTranslate");
				if (isActive) {
					disableQuickTranslate();
					saveActiveFeatures(
						getActiveFeatures().filter((f) => f !== "quickTranslate"),
					);
				} else {
					enableQuickTranslate();
					saveActiveFeatures([...getActiveFeatures(), "quickTranslate"]);
				}
			},
		},

		pageReader: {
			type: "js",
			key: "pageReader",
			handler: () => {
				const isActive = getActiveFeatures().includes("pageReader");
				if (isActive) {
					disablePageReader();
					saveActiveFeatures(
						getActiveFeatures().filter((f) => f !== "pageReader"),
					);
				} else {
					enablePageReader();
					saveActiveFeatures([...getActiveFeatures(), "pageReader"]);
				}
			},
		},

		outlineFocus: {
			type: "js",
			key: "outlineFocus",
			handler: () => {
				const isActive = getActiveFeatures().includes("outlineFocus");
				if (isActive) {
					disableKeyboardNav();
					saveActiveFeatures(
						getActiveFeatures().filter((f) => f !== "outlineFocus"),
					);
				} else {
					enableKeyboardNav();
					saveActiveFeatures([...getActiveFeatures(), "outlineFocus"]);
				}
			},
		},

		highlightHover: {
			type: "js",
			key: "highlightHover",
			handler: () => {
				const isActive = getActiveFeatures().includes("highlightHover");
				if (isActive) {
					disableHighlightHover();
					saveActiveFeatures(
						getActiveFeatures().filter((f) => f !== "highlightHover"),
					);
				} else {
					enableHighlightHover();
					saveActiveFeatures([...getActiveFeatures(), "highlightHover"]);
				}
			},
		},

		magnifiImages: {
			type: "js",
			key: "magnifiImages",
			handler: () => {
				const isActive = getActiveFeatures().includes("magnifiImages");
				if (isActive) {
					disableMagnifiImages();
					saveActiveFeatures(
						getActiveFeatures().filter((f) => f !== "magnifiImages"),
					);
				} else {
					enableMagnifiImages();
					saveActiveFeatures([...getActiveFeatures(), "magnifiImages"]);
				}
			},
		},

		tooltips: {
			type: "js",
			key: "tooltips",
			handler: () => {
				const isActive = getActiveFeatures().includes("tooltips");
				if (isActive) {
					if (window.__accessibilityTooltipCleanup) {
						window.__accessibilityTooltipCleanup();
					}
					saveActiveFeatures(
						getActiveFeatures().filter((f) => f !== "tooltips"),
					);
				} else {
					enableTooltips();
					saveActiveFeatures([...getActiveFeatures(), "tooltips"]);
				}
			},
		},
	};
}

/**
 * Restore pro features on page reload.
 */
export function restoreProFeature(key) {
	switch (key) {
		case "screenReader":
			enableScreenReader();
			break;
		case "outlineFocus":
			enableKeyboardNav();
			break;
		case "quickTranslate":
			enableQuickTranslate();
			break;
		case "pageReader":
			enablePageReader();
			break;
		case "tooltips":
			enableTooltips();
			break;
		case "highlightHover":
			enableHighlightHover();
			break;
		case "magnifiImages":
			enableMagnifiImages();
			break;
		case "pointerTrail":
			try {
				const v = localStorage.getItem(
					"accessibility-widget-pointerTrail-variant",
				);
				if (v) {
					applyPointerTrailVariant(v);
				} else {
					enablePointerTrail();
				}
			} catch {
				enablePointerTrail();
			}
			break;
	}
}

/**
 * Cleanup pro features on reset.
 */
export function cleanupProFeature(key) {
	switch (key) {
		case "screenReader":
			disableScreenReader();
			speak("Screen reader deactivated");
			break;
		case "outlineFocus":
			disableKeyboardNav();
			break;
		case "pageReader":
			disablePageReader();
			break;
		case "quickTranslate":
			disableQuickTranslate();
			break;
		case "tooltips":
			if (window.__accessibilityTooltipCleanup) {
				window.__accessibilityTooltipCleanup();
				delete window.__accessibilityTooltipCleanup;
			}
			break;
		case "highlightHover":
			if (window.__highlightHoverCleanup) {
				window.__highlightHoverCleanup();
				delete window.__highlightHoverCleanup;
			}
			break;
		case "magnifiImages":
			if (window.__magnifiImagesCleanup) {
				window.__magnifiImagesCleanup();
				delete window.__magnifiImagesCleanup;
			}
			break;
		case "pointerTrail":
			if (window.__pointerTrailCleanup) {
				window.__pointerTrailCleanup();
				delete window.__pointerTrailCleanup;
			}
			break;
		case "colorSaturation":
			if (document.documentElement) {
				document.documentElement.style.filter = "none";
			}
			document.body.style.filter = "none";
			break;
	}
}
