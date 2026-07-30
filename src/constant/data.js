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

// Pro-only pages shown in the admin menu as informational teasers (PRO badge +
// upgrade prompt). These have NO functionality in Lite — selecting one only
// shows an "available in EaseAccess Pro" upgrade page. No Pro code ships here.
export const proTabs = ["one-click", "scans", "ai-settings"];

export const proTabLabels = {
	"one-click": "One-Click",
	scans: "Scans",
	"ai-settings": "AI Settings",
};

// Full admin menu order — matches the EaseAccess Pro menu exactly, with the
// Pro-only pages interleaved in the same positions (rendered with a PRO badge).
export const menuOrder = [
	"general",
	"one-click",
	"scans",
	"ai-settings",
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
