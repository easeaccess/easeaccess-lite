export const DEFAULT_LANGUAGE_CODE = "en_US";
export const LANGUAGE_STORAGE_KEY = "easeaccess-language";
export const LANGUAGE_USER_SELECTED_KEY = "easeaccess-language-user-selected";
export const PAGE_TRANSLATION_ENABLED_KEY =
	"easeaccess-page-translation-enabled";

export const LANGUAGES = [
	{ code: "en_US", name: "English" },
	{ code: "zh_CN", name: "Chinese (Simplified)" },
	{ code: "es_ES", name: "Spanish" },
	{ code: "de_DE", name: "German" },
	{ code: "fr_FR", name: "French" },
	{ code: "pt_PT", name: "Portuguese" },
	{ code: "ru_RU", name: "Russian" },
	{ code: "ja_JP", name: "Japanese" },
	{ code: "ko_KR", name: "Korean" },
	{ code: "ar_SA", name: "Arabic" },
	{ code: "hi_IN", name: "Hindi" },
	{ code: "bn_BD", name: "Bangla" },
	{ code: "ur_PK", name: "Urdu" },
	{ code: "tr_TR", name: "Turkish" },
	{ code: "nl_NL", name: "Dutch" },
	{ code: "it_IT", name: "Italian" },
	{ code: "pl_PL", name: "Polish" },
	{ code: "cs_CZ", name: "Czech" },
	{ code: "hu_HU", name: "Hungarian" },
	{ code: "uk_UA", name: "Ukrainian" },
	{ code: "ro_RO", name: "Romanian" },
	{ code: "el_GR", name: "Greek" },
	{ code: "he_IL", name: "Hebrew" },
	{ code: "vi_VN", name: "Vietnamese" },
	{ code: "th_TH", name: "Thai" },
	{ code: "ms_MY", name: "Malay" },
	{ code: "id_ID", name: "Indonesian" },
	{ code: "sv_SE", name: "Swedish" },
	{ code: "nb_NO", name: "Norwegian Bokmal" },
	{ code: "da_DK", name: "Danish" },
	{ code: "fi_FI", name: "Finnish" },
	{ code: "fa_IR", name: "Persian" },
];

export function isSupportedLanguage(code) {
	return LANGUAGES.some((language) => language.code === code);
}

export function normalizeLanguageCode(code) {
	return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE_CODE;
}

export function getConfiguredDefaultLanguage() {
	if (typeof window === "undefined") return DEFAULT_LANGUAGE_CODE;

	return normalizeLanguageCode(
		window.EaseAccessSettings?.default_language ||
			window.ZN7Settings?.default_language ||
			DEFAULT_LANGUAGE_CODE,
	);
}

export function hasUserSelectedLanguage() {
	if (typeof localStorage === "undefined") return false;

	return (
		localStorage.getItem(LANGUAGE_USER_SELECTED_KEY) === "1" ||
		Boolean(localStorage.getItem(LANGUAGE_STORAGE_KEY))
	);
}

export function getUserSelectedLanguage() {
	if (typeof localStorage === "undefined") return null;

	const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
	if (hasUserSelectedLanguage() && saved) {
		return normalizeLanguageCode(saved);
	}

	return null;
}

export function getActiveLanguage() {
	const userSelectedLanguage = getUserSelectedLanguage();
	if (userSelectedLanguage) {
		return userSelectedLanguage;
	}

	return getConfiguredDefaultLanguage();
}

export function persistUserLanguage(languageCode) {
	if (typeof localStorage === "undefined") return;

	const normalized = normalizeLanguageCode(languageCode);
	localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
	localStorage.setItem(LANGUAGE_USER_SELECTED_KEY, "1");
}

export function isPageTranslationEnabled() {
	if (typeof localStorage === "undefined") return true;

	return localStorage.getItem(PAGE_TRANSLATION_ENABLED_KEY) !== "0";
}

export function persistPageTranslationEnabled(enabled) {
	if (typeof localStorage === "undefined") return;

	localStorage.setItem(PAGE_TRANSLATION_ENABLED_KEY, enabled ? "1" : "0");
}

export function dispatchLanguageChanged(languageCode) {
	if (typeof window === "undefined") return;

	window.dispatchEvent(
		new CustomEvent("languageChanged", {
			detail: { language: normalizeLanguageCode(languageCode) },
		}),
	);
}
