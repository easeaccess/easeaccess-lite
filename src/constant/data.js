/**
 * LITE build constants — free version only.
 * No license tab, no scans dashboard.
 * This file replaces data.js in lite builds via webpack alias.
 */
import { Accessibility, Accessible, Blind, EyeOff, TextFileds } from "../icons";

export const tabs = [
	"general",
	"customization",
	"features",
	"statement",
];

export const predefinedIcons = [
	{ name: "Accessibility", icon: Accessibility },
	{ name: "Accessible", icon: Accessible },
	{ name: "Blind", icon: Blind },
	{ name: "EyeOff", icon: EyeOff },
	{ name: "TextFileds", icon: TextFileds },
];

export const sizes = ["sm", "md", "lg"];
export const radius = ["sm", "md", "lg"];
export const sizeLabels = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};

export const radiusLabels = {
	sm: "Square",
	md: "Squircle Small",
	lg: "Rounded",
};
