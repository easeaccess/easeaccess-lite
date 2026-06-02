// Simple translation management for older WordPress versions
const translations = {
    'en_US': {
        'Accessibility Adjustments': 'Accessibility Adjustments',
        'Adjust accessibility settings to improve your experience': 'Adjust accessibility settings to improve your experience',
        'Select Language:': 'Select Language:',
        'Welcome to Accessibly WP': 'Welcome to Accessibly WP',
        'This plugin helps make your website more accessible to all users.': 'This plugin helps make your website more accessible to all users.',
        'Enable Accessibility Features': 'Enable Accessibility Features',
        'Available Features:': 'Available Features:',
        'Increase Text Size': 'Increase Text Size',
        'High Contrast Mode': 'High Contrast Mode',
        'Keyboard Navigation': 'Keyboard Navigation',
        'Screen Reader Support': 'Screen Reader Support',
        'Quick Actions': 'Quick Actions',
        'Reset All Settings': 'Reset All Settings',
        'Help & Documentation': 'Help & Documentation'
    },
    'bn_BD': {
        'Accessibility Adjustments': 'অ্যাক্সেসিবিলিটি সমন্বয়',
        'Adjust accessibility settings to improve your experience': 'আপনার অভিজ্ঞতা উন্নত করতে অ্যাক্সেসিবিলিটি সেটিংস সমন্বয় করুন',
        'Select Language:': 'ভাষা নির্বাচন করুন:',
        'Welcome to Accessibly WP': 'অ্যাক্সেসিবলি ডব্লিউপিতে স্বাগতম',
        'This plugin helps make your website more accessible to all users.': 'এই প্লাগইনটি আপনার ওয়েবসাইটটি সকল ব্যবহারকারীর কাছে আরও অ্যাক্সেসযোগ্য করতে সাহায্য করে।',
        'Enable Accessibility Features': 'অ্যাক্সেসিবিলিটি বৈশিষ্ট্য সক্রিয় করুন',
        'Available Features:': 'উপলব্ধ বৈশিষ্ট্যসমূহ:',
        'Increase Text Size': 'টেক্সটের আকার বাড়ান',
        'High Contrast Mode': 'উচ্চ কনট্রাস্ট মোড',
        'Keyboard Navigation': 'কীবোর্ড নেভিগেশন',
        'Screen Reader Support': 'স্ক্রিন রিডার সাপোর্ট',
        'Quick Actions': 'দ্রুত কার্যক্রম',
        'Reset All Settings': 'সকল সেটিংস রিসেট করুন',
        'Help & Documentation': 'সহায়তা ও ডকুমেন্টেশন'
    },
    'fr_FR': {
        'Accessibility Adjustments': 'Réglages d\'accessibilité',
        'Adjust accessibility settings to improve your experience': 'Ajustez les paramètres d\'accessibilité pour améliorer votre expérience',
        'Select Language:': 'Sélectionner la langue:',
        'Welcome to Accessibly WP': 'Bienvenue dans Accessibly WP',
        'This plugin helps make your website more accessible to all users.': 'Ce plugin aide à rendre votre site web plus accessible à tous les utilisateurs.',
        'Enable Accessibility Features': 'Activer les fonctionnalités d\'accessibilité',
        'Available Features:': 'Fonctionnalités disponibles:',
        'Increase Text Size': 'Augmenter la taille du texte',
        'High Contrast Mode': 'Mode contraste élevé',
        'Keyboard Navigation': 'Navigation au clavier',
        'Screen Reader Support': 'Support de lecteur d\'écran',
        'Quick Actions': 'Actions rapides',
        'Reset All Settings': 'Réinitialiser tous les paramètres',
        'Help & Documentation': 'Aide et documentation'
    }
};

// Custom translation function
export const __ = (text, domain = 'easeaccess') => {
    const currentLanguage = localStorage.getItem('easeaccess-language') || 'en_US';
    
    // Try WordPress i18n first
    if (window.wp && window.wp.i18n && typeof window.wp.i18n.__ === 'function') {
        const translated = window.wp.i18n.__(text, domain);
        if (translated !== text) {
            return translated; // WordPress translation found
        }
    }
    
    // Fallback to our translations
    return translations[currentLanguage]?.[text] || text;
};

// Hook to listen for language changes and trigger re-renders
export const useTranslation = () => {
    const [currentLanguage, setCurrentLanguage] = React.useState(
        localStorage.getItem('easeaccess-language') || 'en_US'
    );

    React.useEffect(() => {
        const handleLanguageChange = (event) => {
            setCurrentLanguage(event.detail.language);
        };

        window.addEventListener('languageChanged', handleLanguageChange);
        return () => window.removeEventListener('languageChanged', handleLanguageChange);
    }, []);

    return { currentLanguage, __ };
};