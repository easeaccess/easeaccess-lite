/**
 * Stub for the Lite build — there are no Pro features to gate.
 * Every feature returns "available", so `isPremiumFeature(...)` is always false.
 */

export const PREMIUM_FEATURES = [];

export const useLicense = () => ({
	isValid: true,
	isActivated: true,
	license: null,
	loading: false,
	error: null,
	activate: () => Promise.resolve({ success: true }),
	deactivate: () => Promise.resolve({ success: true }),
	check: () => Promise.resolve({ valid: true }),
});

export default useLicense;
