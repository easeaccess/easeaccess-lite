/**
 * Stub for Lite — page translation is a Pro feature.
 */
export function translatePage() {
	return Promise.resolve();
}

export function restoreOriginalPage() {}

export function localeToTargetLang(code) {
	return code || "en";
}
