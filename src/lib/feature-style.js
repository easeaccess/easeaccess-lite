/**
 * Lite version of feature-style — exports ONLY free feature functions.
 * Pro functions (screen reader, page reader, translator, keyboard nav,
 * tooltips, magnify, pointer trail, big cursor, etc.) are excluded.
 *
 * This file replaces @/lib/feature-style in lite builds via webpack alias.
 */

// --- Shared utilities ---

export const BASE_SELECTOR =
	":not(#accessibility-widget):not(#accessibility-widget *):not(#accessibility-widgetc):not(#accessibility-widgetc *):not(#accessibility-widget-parent):not(#accessibility-widget-parent *):not([data-radix-popper-content-wrapper]):not([data-radix-popper-content-wrapper] *):not([data-slot='sheet-content']):not([data-slot='sheet-content'] *)";

const WIDGET_RESET = `
#accessibility-widget *,
#accessibility-widgetc *,
#accessibility-widget-parent *,
[data-radix-popper-content-wrapper] *,
[data-slot="sheet-content"] * {
	font-size: revert !important;
	line-height: revert !important;
	letter-spacing: normal !important;
	word-spacing: normal !important;
}
`;

export function removeStyle(id) {
	const el = document.getElementById(id);
	if (el) el.remove();
}

export function injectStyle(id, css) {
	let style = document.getElementById(id);
	if (!style) {
		style = document.createElement("style");
		style.id = id;
		document.head.appendChild(style);
	}
	style.innerText = css;
}

// --- Speech (used by free features like reading guide label) ---

let femaleVoice = null;
let currentUtterance = null;

function initVoice() {
	const voices = speechSynthesis.getVoices();
	if (!voices.length) {
		speechSynthesis.onvoiceschanged = initVoice;
		return;
	}
	femaleVoice =
		voices.find((v) => v.name.includes("Google US English")) ||
		voices.find((v) => v.name.includes("Samantha")) ||
		voices.find((v) => v.name.includes("Zira")) ||
		null;
}
initVoice();

export function stopSpeaking() {
	try {
		if (typeof speechSynthesis !== "undefined") {
			speechSynthesis.cancel();
		}
	} catch {}
	currentUtterance = null;
}

export function speak(text, onEnd = null) {
	try {
		if (speechSynthesis.speaking || speechSynthesis.pending) {
			speechSynthesis.cancel();
		}
	} catch {}
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = "en-US";
	if (femaleVoice) utterance.voice = femaleVoice;
	utterance.onend = () => {
		currentUtterance = null;
		if (onEnd) onEnd();
	};
	utterance.onerror = () => { currentUtterance = null; };
	currentUtterance = utterance;
	speechSynthesis.speak(utterance);
}

export function handleTextSelection() {
	const selectedText = window.getSelection().toString().trim();
	if (selectedText.length > 0) {
		speak(selectedText);
	}
}

// --- Free features ---

export function enableReadingGuide() {
	if (document.getElementById("accessibility-widget-reading-guide")) return;

	const guide = document.createElement("div");
	guide.id = "accessibility-widget-reading-guide";
	guide.style.position = "fixed";
	guide.style.width = "300px";
	guide.style.height = "4px";
	guide.style.background = "#155eef";
	guide.style.borderRadius = "4px";
	guide.style.zIndex = "999999";
	guide.style.pointerEvents = "none";
	guide.style.transition = "top 0.05s ease-out, left 0.05s ease-out";

	document.body.appendChild(guide);

	const onMouseMove = (e) => {
		const offsetX = e.clientX - 150;
		const offsetY = e.clientY;
		guide.style.left = `${offsetX}px`;
		guide.style.top = `${offsetY}px`;
	};

	window.addEventListener("mousemove", onMouseMove);
	guide.dataset.active = "true";

	window.__readingGuideCleanup = () => {
		window.removeEventListener("mousemove", onMouseMove);
		guide.remove();
	};
}

export function disableReadingGuide() {
	if (window.__readingGuideCleanup) {
		window.__readingGuideCleanup();
		delete window.__readingGuideCleanup;
	}
}

export const applyContentAlignment = (stepIndex) => {
	const id = "accessibility-widget-style-contentAlignment";
	removeStyle(id);
	const alignments = ["left", "center", "right"];
	if (stepIndex >= 0 && stepIndex < alignments.length) {
		injectStyle(
			id,
			`${BASE_SELECTOR} { text-align: ${alignments[stepIndex]} !important; }`,
		);
	}
};

export const applyLetterSpacing = (stepIndex) => {
	const id = "accessibility-widget-style-adjustLetterSpacing";
	removeStyle(id);
	if (stepIndex === -1) return;
	const steps = [
		{ letter: "0.05em", word: "0.1em" },
		{ letter: "0.1em", word: "0.2em" },
		{ letter: "0.15em", word: "0.3em" },
	];
	if (stepIndex < 0 || stepIndex >= steps.length) return;
	const { letter, word } = steps[stepIndex];
	const sel = BASE_SELECTOR;
	injectStyle(
		id,
		`
		p${sel}, li${sel}, dd${sel}, dt${sel},
		blockquote${sel}, code${sel}, pre${sel},
		td${sel}, th${sel}, figcaption${sel},
		label${sel}, small${sel} {
			letter-spacing: ${letter} !important;
			word-spacing: ${word} !important;
		}
		input${sel}, textarea${sel}, select${sel}, button${sel} {
			letter-spacing: ${letter} !important;
			word-spacing: ${word} !important;
		}
		h1${sel}, h2${sel}, h3${sel},
		h4${sel}, h5${sel}, h6${sel} {
			letter-spacing: ${letter} !important;
			word-spacing: ${word} !important;
		}
		${WIDGET_RESET}
		`,
	);
};

export function applyLineHeight(stepIndex) {
	const id = "accessibility-widget-style-lineHeight";
	removeStyle(id);
	if (stepIndex === -1) return;
	const steps = [1.5, 1.75, 2, 2.5];
	if (stepIndex < 0 || stepIndex >= steps.length) return;
	const lh = steps[stepIndex];
	const sel = BASE_SELECTOR;
	injectStyle(
		id,
		`
		p${sel}, li${sel}, dd${sel}, dt${sel},
		blockquote${sel}, code${sel}, pre${sel},
		td${sel}, th${sel}, figcaption${sel},
		label${sel}, small${sel} {
			line-height: ${lh} !important;
		}
		input${sel}, textarea${sel}, select${sel}, button${sel} {
			line-height: ${lh} !important;
		}
		h1${sel}, h2${sel}, h3${sel},
		h4${sel}, h5${sel}, h6${sel} {
			line-height: ${Math.min(lh, 1.8)} !important;
		}
		${WIDGET_RESET}
		`,
	);
}

export function applyFontSizing(stepIndex) {
	const id = "accessibility-widget-style-fontSizing";
	removeStyle(id);
	if (stepIndex === -1) return;
	const steps = [
		{ body: 120, heading: 140 },
		{ body: 140, heading: 170 },
		{ body: 160, heading: 200 },
		{ body: 180, heading: 240 },
	];
	if (stepIndex < 0 || stepIndex >= steps.length) return;
	const { body: bp, heading: hp } = steps[stepIndex];
	const sel = BASE_SELECTOR;
	injectStyle(
		id,
		`
		p${sel}, li${sel}, dd${sel}, dt${sel},
		blockquote${sel}, code${sel}, pre${sel},
		td${sel}, th${sel}, figcaption${sel},
		label${sel}, small${sel} {
			font-size: ${bp}% !important;
		}
		input${sel}, textarea${sel}, select${sel}, button${sel} {
			font-size: ${bp}% !important;
		}
		h1${sel} { font-size: ${hp}% !important; }
		h2${sel} { font-size: ${Math.round(hp * 0.85)}% !important; }
		h3${sel} { font-size: ${Math.round(hp * 0.72)}% !important; }
		h4${sel} { font-size: ${Math.round(hp * 0.62)}% !important; }
		h5${sel} { font-size: ${Math.round(hp * 0.55)}% !important; }
		h6${sel} { font-size: ${Math.round(hp * 0.5)}% !important; }
		${WIDGET_RESET}
		`,
	);
}
