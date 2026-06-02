/**
 * Stub for Lite — multi-language page translation is a Pro feature.
 * The exports below return safe defaults so any leftover references compile.
 */

export const LANGUAGES = [];
export const LANGUAGE_STORAGE_KEY = "easeaccess_lite_language";
export const DEFAULT_LANGUAGE_CODE = "en";

export function getActiveLanguage() {
	return "en";
}

export function getUserSelectedLanguage() {
	return null;
}

export function hasUserSelectedLanguage() {
	return false;
}

export function isPageTranslationEnabled() {
	return false;
}

export function persistPageTranslationEnabled() {}

export function persistUserLanguage() {}

export function dispatchLanguageChanged() {}

export function localeToTargetLang(code) {
	return code || "en";
}
