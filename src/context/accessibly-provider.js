// admin/context/CountProvider.js
import { useState, useMemo } from "@wordpress/element";
import AccessiblyContext from "./accessibly-context";
import useSettings from "../hooks/use-settings";

export const AccessiblyProvider = ({ children }) => {
	const {
		features,
		setFeatures,
		svgSettings,
		setSvgSettings,
		isSaving,
		isLoading,
		loadSettings,
		saveSettings,
		hasChanges,
	} = useSettings();
	const contextValue = useMemo(
		() => ({
			features,
			setFeatures,
			svgSettings,
			setSvgSettings,
			isSaving,
			isLoading,
			loadSettings,
			saveSettings,
			hasChanges,
		}),
		[features, svgSettings, isSaving, isLoading],
	);
	return (
		<AccessiblyContext.Provider value={contextValue}>
			{children}
		</AccessiblyContext.Provider>
	);
};
