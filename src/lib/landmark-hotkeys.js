/**
 * Numbered landmark hotkeys (UserWay-style).
 *
 * When enabled, pressing Alt+1 .. Alt+9 jumps focus and scroll to the
 * Nth landmark on the page. Alt+0 jumps to the next heading after the
 * current scroll position. A small floating cheat-sheet appears for
 * 4 seconds when the feature is first enabled.
 *
 * Landmarks are detected in this priority order:
 *   1. <main> / role="main"
 *   2. <nav> / role="navigation"
 *   3. <header> / role="banner"
 *   4. <aside> / role="complementary"
 *   5. <footer> / role="contentinfo"
 *   6. <section[aria-label]> / role="region"
 *   7. <form[aria-label]> / role="search"
 *
 * Widget UI itself is excluded.
 */

const HOTKEY_STYLE_ID = "easeaccess-landmark-hotkeys-style";
const HOTKEY_HINT_ID = "easeaccess-landmark-hotkeys-hint";
const HOTKEY_RING_CLASS = "easeaccess-landmark-ring";

const LANDMARK_SELECTOR = [
	"main",
	"[role='main']",
	"nav",
	"[role='navigation']",
	"header",
	"[role='banner']",
	"aside",
	"[role='complementary']",
	"footer",
	"[role='contentinfo']",
	"section[aria-label]",
	"section[aria-labelledby]",
	"[role='region']",
	"form[aria-label]",
	"[role='search']",
].join(",");

function isPluginUi(el) {
	if (!el) return false;
	return !!el.closest(
		"[data-easeaccess-ui], #accessibility-widget, #accessibility-widgetc, #accessibility-widget-parent, [data-radix-popper-content-wrapper], [data-slot='sheet-content']",
	);
}

function getLandmarks() {
	const all = Array.from(document.querySelectorAll(LANDMARK_SELECTOR));
	const seen = new Set();
	return all
		.filter((el) => !isPluginUi(el))
		.filter((el) => {
			// Deduplicate (e.g. <main role="main">)
			if (seen.has(el)) return false;
			seen.add(el);
			// Skip hidden landmarks
			const rect = el.getBoundingClientRect();
			if (rect.width === 0 && rect.height === 0) return false;
			return true;
		})
		.slice(0, 9);
}

function describeLandmark(el) {
	const role =
		el.getAttribute("role") ||
		({
			MAIN: "main",
			NAV: "navigation",
			HEADER: "banner",
			ASIDE: "complementary",
			FOOTER: "contentinfo",
			SECTION: "region",
			FORM: "form",
		}[el.tagName] || el.tagName.toLowerCase());
	const label =
		el.getAttribute("aria-label") ||
		(el.getAttribute("aria-labelledby")
			? document.getElementById(el.getAttribute("aria-labelledby"))
					?.textContent
			: null);
	return label ? `${role} — ${label}` : role;
}

function injectStyles() {
	if (document.getElementById(HOTKEY_STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = HOTKEY_STYLE_ID;
	style.textContent = `
		.${HOTKEY_RING_CLASS} {
			outline: 3px solid #155eef !important;
			outline-offset: 4px !important;
			transition: outline 0.2s ease;
		}
	`;
	document.head.appendChild(style);
}

function showHint(landmarks) {
	let hint = document.getElementById(HOTKEY_HINT_ID);
	if (hint) hint.remove();
	hint = document.createElement("div");
	hint.id = HOTKEY_HINT_ID;
	hint.setAttribute("data-easeaccess-ui", "landmark-hint");
	hint.setAttribute("role", "status");
	hint.setAttribute("aria-live", "polite");
	Object.assign(hint.style, {
		position: "fixed",
		bottom: "16px",
		left: "16px",
		zIndex: "999999",
		maxWidth: "320px",
		padding: "12px 14px",
		background: "#0b1220",
		color: "#fff",
		fontSize: "12px",
		lineHeight: "1.5",
		borderRadius: "8px",
		boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
		fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
	});
	const items = landmarks
		.map(
			(el, i) =>
				`<div><strong style="color:#7dd3fc">Alt+${i + 1}</strong> → ${describeLandmark(el)}</div>`,
		)
		.join("");
	hint.innerHTML = `
		<div style="font-weight:600;margin-bottom:6px">Landmark shortcuts</div>
		${items || "<div>No landmarks found on this page.</div>"}
		<div style="margin-top:6px;opacity:0.7;font-size:11px">Press Esc to dismiss</div>
	`;
	document.body.appendChild(hint);
	const dismiss = () => {
		hint?.remove();
		document.removeEventListener("keydown", onKey);
	};
	const onKey = (e) => {
		if (e.key === "Escape") dismiss();
	};
	document.addEventListener("keydown", onKey);
	setTimeout(dismiss, 6000);
}

function jumpToLandmark(index) {
	const landmarks = getLandmarks();
	const el = landmarks[index];
	if (!el) return;

	// Make focusable if not already
	if (!el.hasAttribute("tabindex")) {
		el.setAttribute("tabindex", "-1");
	}
	el.scrollIntoView({ behavior: "smooth", block: "start" });
	el.focus({ preventScroll: true });

	// Visual ring
	document
		.querySelectorAll("." + HOTKEY_RING_CLASS)
		.forEach((n) => n.classList.remove(HOTKEY_RING_CLASS));
	el.classList.add(HOTKEY_RING_CLASS);
	setTimeout(() => el.classList.remove(HOTKEY_RING_CLASS), 1500);

	// Announce
	if (window.__easeaccessAnnounce) {
		window.__easeaccessAnnounce(`Jumped to ${describeLandmark(el)}`);
	}
}

function jumpToNextHeading() {
	const headings = Array.from(
		document.querySelectorAll("h1,h2,h3,h4,h5,h6"),
	).filter((h) => !isPluginUi(h));
	if (!headings.length) return;
	const scrollY = window.scrollY + 80;
	const next =
		headings.find((h) => h.getBoundingClientRect().top + window.scrollY > scrollY) ||
		headings[0];
	if (!next.hasAttribute("tabindex")) next.setAttribute("tabindex", "-1");
	next.scrollIntoView({ behavior: "smooth", block: "start" });
	next.focus({ preventScroll: true });
	next.classList.add(HOTKEY_RING_CLASS);
	setTimeout(() => next.classList.remove(HOTKEY_RING_CLASS), 1500);
	if (window.__easeaccessAnnounce) {
		window.__easeaccessAnnounce(
			`Jumped to ${next.tagName}: ${next.textContent.trim().slice(0, 60)}`,
		);
	}
}

function onKeydown(e) {
	// Ignore when user is typing
	const tag = (e.target?.tagName || "").toLowerCase();
	if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) {
		return;
	}
	if (!e.altKey || e.ctrlKey || e.metaKey) return;

	if (e.key >= "1" && e.key <= "9") {
		e.preventDefault();
		jumpToLandmark(parseInt(e.key, 10) - 1);
	} else if (e.key === "0") {
		e.preventDefault();
		jumpToNextHeading();
	} else if (e.key === "/" || e.key === "?") {
		// Show cheat-sheet
		e.preventDefault();
		showHint(getLandmarks());
	}
}

export function enableLandmarkHotkeys() {
	injectStyles();
	document.addEventListener("keydown", onKeydown);
	// Show cheat-sheet on activation
	showHint(getLandmarks());
}

export function disableLandmarkHotkeys() {
	document.removeEventListener("keydown", onKeydown);
	document
		.querySelectorAll("." + HOTKEY_RING_CLASS)
		.forEach((n) => n.classList.remove(HOTKEY_RING_CLASS));
	document.getElementById(HOTKEY_HINT_ID)?.remove();
	document.getElementById(HOTKEY_STYLE_ID)?.remove();
}
