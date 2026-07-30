import { createContext, useContext } from "@wordpress/element";

const defaults = {
	isValid: true,
	isActivated: true,
	license: null,
	// Lite never owns Pro features, so every Pro feature reads as "locked".
	// This only drives the informational PRO badges/teasers in the admin UI.
	hasFeature: () => false,
};

const LicenseContext = createContext(defaults);

export const useLicense = () => useContext(LicenseContext) || defaults;

export default LicenseContext;
