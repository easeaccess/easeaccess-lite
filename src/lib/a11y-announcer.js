/**
 * Lightweight, framework-free helper that maintains a single visually hidden
 * polite aria-live region on <body> and lets any module announce a string
 * to assistive technologies.
 *
 * Usage:
 *   import { announce } from "@/lib/a11y-announcer";
 *   announce("Dyslexia-friendly font enabled");
 */

const REGION_ID = "easeaccess-live-region";

function getOrCreateRegion() {
	if (typeof document === "undefined") return null;
	let region = document.getElementById(REGION_ID);
	if (!region) {
		region = document.createElement("div");
		region.id = REGION_ID;
		region.setAttribute("aria-live", "polite");
		region.setAttribute("aria-atomic", "true");
		region.setAttribute("role", "status");
		region.style.cssText =
			"position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;";
		document.body.appendChild(region);
	}
	return region;
}

export function announce(message) {
	const region = getOrCreateRegion();
	if (!region || !message) return;
	// Reset to force AT to re-announce identical messages.
	region.textContent = "";
	setTimeout(() => {
		region.textContent = String(message);
	}, 30);
}

// Expose a global hook so framework-free modules (like landmark hotkeys
// or voice commands) can announce without importing this module.
if (typeof window !== "undefined") {
	window.__easeaccessAnnounce = announce;
}
