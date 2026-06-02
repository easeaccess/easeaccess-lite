/**
 * Voice command handler using the Web Speech Recognition API.
 *
 * Supported commands (English):
 *   "scroll down" / "scroll up" / "scroll to top" / "scroll to bottom"
 *   "go back" / "go forward"
 *   "reload" / "refresh"
 *   "click <text>"          — clicks the first link/button whose visible
 *                             text or aria-label contains <text>
 *   "open <text>"           — alias for "click"
 *   "search <text>"         — focuses the first input[type=search]
 *                             or input[name*=search] and types <text>
 *   "next heading" / "previous heading"
 *   "next landmark" / "previous landmark"
 *   "stop listening"        — turns the feature off
 *   "help" / "what can I say" — shows the cheat-sheet
 *
 * Listening is continuous but throttled. A floating mic indicator shows
 * status. Microphone permission is requested by the browser the first
 * time the feature is enabled.
 */

const INDICATOR_ID = "easeaccess-voice-indicator";
const HINT_ID = "easeaccess-voice-hint";

let recognition = null;
let isListening = false;

function getRecognition() {
	const SR =
		typeof window !== "undefined" &&
		(window.SpeechRecognition || window.webkitSpeechRecognition);
	return SR ? new SR() : null;
}

function announce(msg) {
	if (typeof window !== "undefined" && window.__easeaccessAnnounce) {
		window.__easeaccessAnnounce(msg);
	}
}

function ensureIndicator() {
	let el = document.getElementById(INDICATOR_ID);
	if (el) return el;
	el = document.createElement("div");
	el.id = INDICATOR_ID;
	el.setAttribute("data-easeaccess-ui", "voice-indicator");
	el.setAttribute("role", "status");
	el.setAttribute("aria-live", "polite");
	Object.assign(el.style, {
		position: "fixed",
		bottom: "16px",
		right: "16px",
		zIndex: "999999",
		padding: "8px 12px",
		background: "#0b1220",
		color: "#fff",
		fontSize: "12px",
		borderRadius: "999px",
		boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
		display: "flex",
		alignItems: "center",
		gap: "8px",
		fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
	});
	el.innerHTML = `
		<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;animation:easeaccess-pulse 1.2s ease-in-out infinite"></span>
		<span data-label>Listening…</span>
	`;
	const style = document.createElement("style");
	style.textContent = `
		@keyframes easeaccess-pulse {
			0%,100% { opacity:1; transform:scale(1); }
			50% { opacity:.4; transform:scale(.8); }
		}
	`;
	el.appendChild(style);
	document.body.appendChild(el);
	return el;
}

function setIndicator(text, color) {
	const el = document.getElementById(INDICATOR_ID);
	if (!el) return;
	const dot = el.querySelector("span:first-child");
	const label = el.querySelector("[data-label]");
	if (label) label.textContent = text;
	if (dot && color) dot.style.background = color;
}

function showHelp() {
	let hint = document.getElementById(HINT_ID);
	if (hint) hint.remove();
	hint = document.createElement("div");
	hint.id = HINT_ID;
	hint.setAttribute("data-easeaccess-ui", "voice-hint");
	Object.assign(hint.style, {
		position: "fixed",
		bottom: "60px",
		right: "16px",
		zIndex: "999999",
		maxWidth: "280px",
		padding: "12px 14px",
		background: "#0b1220",
		color: "#fff",
		fontSize: "12px",
		lineHeight: "1.6",
		borderRadius: "8px",
		boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
		fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
	});
	hint.innerHTML = `
		<div style="font-weight:600;margin-bottom:6px">Try saying:</div>
		<div>• "scroll down" / "scroll to top"</div>
		<div>• "click <em>login</em>"</div>
		<div>• "search <em>contact</em>"</div>
		<div>• "next heading" / "next landmark"</div>
		<div>• "go back" / "reload"</div>
		<div>• "stop listening"</div>
	`;
	document.body.appendChild(hint);
	setTimeout(() => hint.remove(), 8000);
}

function isPluginUi(el) {
	if (!el) return false;
	return !!el.closest(
		"[data-easeaccess-ui], #accessibility-widget, #accessibility-widgetc, #accessibility-widget-parent, [data-radix-popper-content-wrapper], [data-slot='sheet-content']",
	);
}

function findClickable(text) {
	const needle = text.trim().toLowerCase();
	if (!needle) return null;
	const candidates = Array.from(
		document.querySelectorAll(
			"a, button, [role='button'], [role='link'], input[type='button'], input[type='submit']",
		),
	).filter((el) => !isPluginUi(el));

	// Score: exact aria-label > exact visible text > startsWith > includes
	let best = null;
	let bestScore = 0;
	for (const el of candidates) {
		const label = (el.getAttribute("aria-label") || "").trim().toLowerCase();
		const txt = (el.textContent || "").trim().toLowerCase();
		let score = 0;
		if (label === needle) score = 100;
		else if (txt === needle) score = 90;
		else if (label.startsWith(needle) || txt.startsWith(needle)) score = 60;
		else if (label.includes(needle) || txt.includes(needle)) score = 30;
		if (score > bestScore) {
			bestScore = score;
			best = el;
		}
	}
	return best;
}

function jumpRelative(selector, direction) {
	const all = Array.from(document.querySelectorAll(selector)).filter(
		(el) => !isPluginUi(el),
	);
	if (!all.length) return false;
	const scrollY = window.scrollY + 80;
	let target;
	if (direction === "next") {
		target =
			all.find((h) => h.getBoundingClientRect().top + window.scrollY > scrollY) ||
			all[0];
	} else {
		const before = all.filter(
			(h) => h.getBoundingClientRect().top + window.scrollY < scrollY - 20,
		);
		target = before.length ? before[before.length - 1] : all[all.length - 1];
	}
	if (!target) return false;
	if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
	target.scrollIntoView({ behavior: "smooth", block: "start" });
	target.focus({ preventScroll: true });
	return true;
}

function handleTranscript(raw) {
	const transcript = raw.toLowerCase().trim();
	if (!transcript) return;

	setIndicator(`"${raw}"`, "#fbbf24");
	setTimeout(() => setIndicator("Listening…", "#22c55e"), 1500);

	// Stop / off
	if (/^(stop listening|stop voice|turn off voice)$/.test(transcript)) {
		announce("Voice commands turned off");
		disableVoiceCommands();
		return;
	}

	// Help
	if (/^(help|what can i say|show commands)$/.test(transcript)) {
		showHelp();
		return;
	}

	// Scroll
	if (/^scroll (to )?top$/.test(transcript)) {
		window.scrollTo({ top: 0, behavior: "smooth" });
		announce("Scrolled to top");
		return;
	}
	if (/^scroll (to )?bottom$/.test(transcript)) {
		window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
		announce("Scrolled to bottom");
		return;
	}
	if (/^scroll down$/.test(transcript)) {
		window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
		return;
	}
	if (/^scroll up$/.test(transcript)) {
		window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
		return;
	}

	// History
	if (/^go back$/.test(transcript)) {
		history.back();
		return;
	}
	if (/^go forward$/.test(transcript)) {
		history.forward();
		return;
	}
	if (/^(reload|refresh)( page)?$/.test(transcript)) {
		location.reload();
		return;
	}

	// Heading / landmark navigation
	if (/^next heading$/.test(transcript)) {
		jumpRelative("h1,h2,h3,h4,h5,h6", "next");
		return;
	}
	if (/^previous heading$/.test(transcript)) {
		jumpRelative("h1,h2,h3,h4,h5,h6", "prev");
		return;
	}
	if (/^next landmark$/.test(transcript)) {
		jumpRelative(
			"main,nav,header,aside,footer,[role='main'],[role='navigation'],[role='banner'],[role='complementary'],[role='contentinfo'],[role='region']",
			"next",
		);
		return;
	}
	if (/^previous landmark$/.test(transcript)) {
		jumpRelative(
			"main,nav,header,aside,footer,[role='main'],[role='navigation'],[role='banner'],[role='complementary'],[role='contentinfo'],[role='region']",
			"prev",
		);
		return;
	}

	// Search "search <text>"
	const searchMatch = transcript.match(/^search (.+)$/);
	if (searchMatch) {
		const term = searchMatch[1];
		const input =
			document.querySelector("input[type='search']:not([data-easeaccess-ui] *)") ||
			document.querySelector("input[name*='search']:not([data-easeaccess-ui] *)") ||
			document.querySelector("input[placeholder*='search' i]:not([data-easeaccess-ui] *)");
		if (input && !isPluginUi(input)) {
			input.focus();
			input.value = term;
			input.dispatchEvent(new Event("input", { bubbles: true }));
			announce(`Search field filled with ${term}`);
		} else {
			announce("No search field found on this page");
		}
		return;
	}

	// Click / open "<text>"
	const clickMatch = transcript.match(/^(click|open|press|tap) (.+)$/);
	if (clickMatch) {
		const target = findClickable(clickMatch[2]);
		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "center" });
			target.focus?.();
			setTimeout(() => target.click(), 150);
			announce(`Clicked ${(target.textContent || "element").trim().slice(0, 40)}`);
		} else {
			announce(`Could not find ${clickMatch[2]}`);
		}
		return;
	}

	announce(`Unrecognized command: ${raw}. Say "help" for options.`);
}

export function enableVoiceCommands() {
	if (isListening) return true;
	const SR =
		typeof window !== "undefined" &&
		(window.SpeechRecognition || window.webkitSpeechRecognition);
	if (!SR) {
		alert(
			"Voice commands are not supported in this browser. Please use Chrome, Edge, or Safari.",
		);
		announce("Voice recognition not supported in this browser");
		return false;
	}

	recognition = new SR();
	recognition.continuous = true;
	recognition.interimResults = false;
	recognition.lang = document.documentElement.lang || "en-US";

	recognition.onresult = (e) => {
		const last = e.results[e.results.length - 1];
		if (last && last[0]) {
			handleTranscript(last[0].transcript);
		}
	};
	recognition.onerror = (e) => {
		if (e.error === "no-speech") return; // ignore silence
		if (e.error === "not-allowed" || e.error === "service-not-allowed") {
			announce(
				"Microphone permission denied. Please allow microphone access in your browser settings.",
			);
			disableVoiceCommands();
			return;
		}
		setIndicator(`Error: ${e.error}`, "#ef4444");
		setTimeout(() => setIndicator("Listening…", "#22c55e"), 2000);
	};
	recognition.onend = () => {
		// Auto-restart if still meant to be listening (Chrome stops after ~60s).
		if (isListening) {
			try {
				recognition.start();
			} catch {
				/* already started */
			}
		}
	};

	try {
		recognition.start();
		isListening = true;
		ensureIndicator();
		setIndicator("Listening…", "#22c55e");
		announce("Voice commands enabled. Say help for a list of commands.");
		showHelp();
		return true;
	} catch (err) {
		console.warn("Voice recognition failed to start:", err);
		announce("Could not start voice recognition");
		return false;
	}
}

export function disableVoiceCommands() {
	isListening = false;
	if (recognition) {
		try {
			recognition.stop();
		} catch {}
		recognition = null;
	}
	document.getElementById(INDICATOR_ID)?.remove();
	document.getElementById(HINT_ID)?.remove();
}

export function isVoiceCommandsActive() {
	return isListening;
}
