import { useState, useEffect } from "@wordpress/element";

export function usePersistentTab(storageKey, tabs, defaultTab) {
	const [activeTab, setActiveTab] = useState(defaultTab);

	useEffect(() => {
		const saved = localStorage.getItem(storageKey);
		if (saved && tabs.includes(saved)) {
			setActiveTab(saved);
		}
	}, [storageKey, tabs]);

	const changeTab = (tab) => {
		if (tabs.includes(tab)) {
			setActiveTab(tab);
			localStorage.setItem(storageKey, tab);
		}
	};

	return [activeTab, changeTab];
}
