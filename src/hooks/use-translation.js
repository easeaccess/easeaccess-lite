import { useState, useEffect } from "@wordpress/element";
import { allTranslations } from "../lib/all-translations";
import { getActiveLanguage, LANGUAGE_STORAGE_KEY } from "../lib/languages";

const translations = allTranslations;

export const useTranslation = () => {
	const [currentLanguage, setCurrentLanguage] = useState(() =>
		getActiveLanguage(),
	);
	const [, forceUpdate] = useState({});

	const __ = (text, domain = "easeaccess") => {
		if (
			window.wp &&
			window.wp.i18n &&
			typeof window.wp.i18n.__ === "function"
		) {
			const translated = window.wp.i18n.__(text, domain);
			if (translated !== text) return translated;
		}

		return translations[currentLanguage]?.[text] || text;
	};

	useEffect(() => {
		const handleLanguageChange = (event) => {
			setCurrentLanguage(event.detail.language);
			forceUpdate({});
		};

		const handleStorageChange = (event) => {
			if (event.key === LANGUAGE_STORAGE_KEY) {
				setCurrentLanguage(getActiveLanguage());
				forceUpdate({});
			}
		};

		window.addEventListener("languageChanged", handleLanguageChange);
		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("languageChanged", handleLanguageChange);
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	return { __, currentLanguage };
};
