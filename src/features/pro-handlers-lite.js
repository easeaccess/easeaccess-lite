/**
 * Pro feature STUBS for lite builds.
 * No pro code exists here — just upgrade prompts.
 * This file replaces pro-handlers.js in lite builds via webpack alias.
 */

const noop = () => {};

// Stubs for all pro exports
export const scanPageStructure = () => null;
export const createReadingMask = noop;
export const removeReadingMask = noop;
export const enablePointerTrail = noop;
export const disablePointerTrail = noop;
export const applyPointerTrailVariant = noop;
export const getPointerTrailVariant = () => "default";
export const applyBigCursorStyle = noop;
export const applyColorSaturation = noop;
export const applyBodyZoom = noop;
export const enableScreenReader = noop;
export const disableScreenReader = noop;
export const enableKeyboardNav = noop;
export const disableKeyboardNav = noop;
export const enablePageReader = noop;
export const disablePageReader = noop;
export const enableQuickTranslate = noop;
export const disableQuickTranslate = noop;
export const enableTooltips = noop;
export const disableTooltips = noop;
export const enableHighlightHover = noop;
export const disableHighlightHover = noop;
export const enableMagnifiImages = noop;
export const disableMagnifiImages = noop;

/**
 * Returns empty config — pro features show upgrade CTA via isPremiumFeature check.
 */
export function getProFeatureConfig() {
	return {};
}

export function restoreProFeature() {}
export function cleanupProFeature() {}
