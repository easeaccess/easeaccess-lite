import { useState, useEffect } from "@wordpress/element";
import { Languages } from "lucide-react";

// Custom translation function that works without setLocale
const useTranslate = () => {
	const [currentLanguage, setCurrentLanguage] = useState(() => {
		return localStorage.getItem("easeaccess-language") || "en_US";
	});

	const translations = {
		en_US: {
			"Accessibility Adjustments": "Accessibility Adjustments",
			"Adjust accessibility settings to improve your experience":
				"Adjust accessibility settings to improve your experience",
		},
		bn_BD: {
			"Accessibility Adjustments": "অ্যাক্সেসিবিলিটি সমন্বয়",
			"Adjust accessibility settings to improve your experience":
				"আপনার অভিজ্ঞতা উন্নত করতে অ্যাক্সেসিবিলিটি সেটিংস সমন্বয় করুন",
		},
		fr_FR: {
			"Accessibility Adjustments": "Réglages d'accessibilité",
			"Adjust accessibility settings to improve your experience":
				"Ajustez les paramètres d'accessibilité pour améliorer votre expérience",
		},
	};

	const __ = (text) => {
		return translations[currentLanguage]?.[text] || text;
	};

	useEffect(() => {
		const handleLanguageChange = (event) => {
			setCurrentLanguage(event.detail.language);
		};

		window.addEventListener("languageChanged", handleLanguageChange);
		return () =>
			window.removeEventListener("languageChanged", handleLanguageChange);
	}, []);

	return { __, currentLanguage, setCurrentLanguage };
};

const LanguageSwitcherFallback = () => {
	const { __, currentLanguage, setCurrentLanguage } = useTranslate();

	const languages = [
		{ code: "en_US", name: "English", flag: "🇺🇸" },
		{ code: "bn_BD", name: "বাংলা", flag: "🇧🇩" },
		{ code: "fr_FR", name: "Français", flag: "🇫🇷" },
	];

	const handleLanguageChange = (event) => {
		const newLanguage = event.target.value;
		//console.log('🌐 LanguageSwitcher - Changing from:', currentLanguage, 'to:', newLanguage);

		setCurrentLanguage(newLanguage);
		localStorage.setItem("easeaccess-language", newLanguage);

		//console.log('🌐 LanguageSwitcher - Saved to localStorage:', localStorage.getItem('easeaccess-language'));

		// Trigger custom event for other components
		window.dispatchEvent(
			new CustomEvent("languageChanged", {
				detail: { language: newLanguage },
			}),
		);

		//console.log('🌐 LanguageSwitcher - Event dispatched for:', newLanguage);
	};

	return (
		<div className="zn:flex zn:items-center zn:gap-2">
			<Languages className="zn:size-4" />
			<select
				value={currentLanguage}
				onChange={handleLanguageChange}
				className="zn:bg-transparent zn:border-none zn:text-sm zn:cursor-pointer zn:outline-none"
			>
				{languages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.flag} {lang.name}
					</option>
				))}
			</select>
		</div>
	);
};

export default LanguageSwitcherFallback;
