/**
 * LITE build premium-features stub.
 * Empty map — no features are premium in lite, no labels exist.
 * This file replaces premium-features.js in lite builds via webpack alias.
 */
export const PREMIUM_FEATURES_MAP = {};
export const PREMIUM_FEATURE_KEYS = [];
export const PREMIUM_FEATURE_LABELS = [];
export const isPremiumFeature = () => false;
export const getPremiumLabel = (key) => key;
