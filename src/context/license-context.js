import { createContext, useContext } from "@wordpress/element";

const defaults = {
	isValid: true,
	isActivated: true,
	license: null,
};

const LicenseContext = createContext(defaults);

export const useLicense = () => useContext(LicenseContext) || defaults;

export default LicenseContext;
