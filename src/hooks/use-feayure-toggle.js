/**
 * LITE feature toggle hook — only free features.
 * No premium feature handlers or imports.
 * Replaces use-feayure-toggle.js in lite builds via webpack alias.
 */
import {
	enableReadingGuide,
	disableReadingGuide,
	applyContentAlignment,
	applyLineHeight,
	applyLetterSpacing,
	applyFontSizing,
	BASE_SELECTOR,
	removeStyle,
	injectStyle,
} from "@/lib/feature-style";
import { useEffect, useState } from "@wordpress/element";

// Big Cursor (free CSS-only version)
function applyBigCursor(sizeKey) {
	const id = "accessibility-widget-style-bigCursor";
	removeStyle(id);
	const sizes = { sm: 32, md: 48, lg: 64 };
	const size = sizes[sizeKey] || 48;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="1"><path d="M3 2 L3 22 L8 17 L11 22 L13 21 L10 16 L17 16 Z"/></svg>`;
	const dataUrl = `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")}`;
	const css = `*:not(:is(#accessibility-widget, #accessibility-widget *, #accessibility-widgetc, #accessibility-widgetc *, #accessibility-widget-parent, #accessibility-widget-parent *, [data-radix-popper-content-wrapper], [data-radix-popper-content-wrapper] *)) { cursor: url('${dataUrl}') 4 4, auto !important; }
#accessibility-widget, #accessibility-widget *, #accessibility-widgetc, #accessibility-widgetc *, #accessibility-widget-parent, #accessibility-widget-parent *, [data-radix-popper-content-wrapper], [data-radix-popper-content-wrapper] * { cursor: auto !important; }`;
	injectStyle(id, css);
}

export const featureConfig = {
	highlightLinks: {
		type: "style",
		css: `* a {
			background: #FFFB00 !important;
			color: #010101 !important;
			text-decoration: underline !important;
			font-weight: bold !important;
		}`,
	},

	contrast: {
		type: "js",
		steps: [0, 1, 2, 3],
		key: "contrast",
		handler: () => {
			handleStepBasedFeature("contrast", [0, 1, 2], applyContrastMode, () => {
				removeStyle("accessibility-widget-style-contrast");
			});
		},
	},

	highlightTitles: {
		type: "style",
		css: `*:not(#accessibility-widget):not(#accessibility-widget *) h1,
		 *:not(#accessibility-widget):not(#accessibility-widget *) h2,
		 *:not(#accessibility-widget):not(#accessibility-widget *) h3,
		 *:not(#accessibility-widget):not(#accessibility-widget *) h4,
		 *:not(#accessibility-widget):not(#accessibility-widget *) h5,
		 *:not(#accessibility-widget):not(#accessibility-widget *) h6 {
			outline: 2px solid #F95738 !important;
			outline-offset: 2px !important;
		}`,
	},

	readableFont: {
		type: "style",
		css: `*:not(i):not(span){font-family:Arial, sans-serif !important;}`,
	},

	adjustFontSizing: {
		type: "js",
		steps: [0, 1, 2, 3],
		key: "adjustFontSizing",
		handler: () => {
			handleStepBasedFeature("adjustFontSizing", [0, 1, 2], applyFontSizing, () => {
				applyFontSizing(-1);
				removeStyle("accessibility-widget-style-fontSizing");
			});
		},
	},

	adjustLineHeight: {
		type: "js",
		steps: [1, 2, 3, 4],
		key: "adjustLineHeight",
		handler: () => {
			handleStepBasedFeature("adjustLineHeight", [1, 2, 3], applyLineHeight, () => {
				applyLineHeight(-1);
				removeStyle("accessibility-widget-style-adjustLineHeight");
			});
		},
	},

	adjustLetterSpacing: {
		type: "js",
		steps: [1, 2, 3, 4],
		key: "adjustLetterSpacing",
		handler: () => {
			handleStepBasedFeature("adjustLetterSpacing", [1, 2, 3], applyLetterSpacing, () => {
				applyLetterSpacing(-1);
				removeStyle("accessibility-widget-style-adjustLetterSpacing");
			});
		},
	},

	contentAlignment: {
		type: "js",
		steps: [0, 1, 2, 3],
		key: "contentAlignment",
		handler: () => {
			handleStepBasedFeature("contentAlignment", [0, 1, 2], applyContentAlignment, () => {
				removeStyle("accessibility-widget-style-contentAlignment");
			});
		},
	},

	greyscale: {
		type: "style",
		css: `html { filter: grayscale(1) !important; }`,
	},

	bigCursor: {
		type: "js",
		steps: [0, 1, 2, 3],
		key: "bigCursor",
		handler: () => {
			const sizes = ["sm", "md", "lg"];
			const applySize = (stepIndex) => {
				let active = getActiveFeatures();
				if (!active.includes("bigCursor")) {
					saveActiveFeatures([...active, "bigCursor"]);
				}
				const sizeKey = sizes[stepIndex] || "lg";
				try {
					localStorage.setItem("accessibility-widget-bigCursor-size", sizeKey);
				} catch {}
				applyBigCursor(sizeKey);
			};
			handleStepBasedFeature("bigCursor", sizes, applySize, () => {
				removeStyle("accessibility-widget-style-bigCursor");
				try {
					localStorage.removeItem("accessibility-widget-bigCursor-size");
				} catch {}
			});
		},
	},

	readingGuide: {
		type: "js",
		key: "readingGuide",
		handler: () => {
			const isActive = getActiveFeatures().includes("readingGuide");
			if (isActive) {
				disableReadingGuide();
				saveActiveFeatures(getActiveFeatures().filter((f) => f !== "readingGuide"));
			} else {
				enableReadingGuide();
				saveActiveFeatures([...getActiveFeatures(), "readingGuide"]);
			}
		},
	},
};

// --- LocalStorage Helpers ---
function getActiveFeatures() {
	try {
		return JSON.parse(
			localStorage.getItem("accessibility-widget-active-features") || "[]",
		);
	} catch {
		return [];
	}
}

function saveActiveFeatures(features) {
	localStorage.setItem(
		"accessibility-widget-active-features",
		JSON.stringify(features),
	);
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event("accessibility-features-changed"));
	}
}

function getFeatureStep(key) {
	const data = JSON.parse(
		localStorage.getItem("accessibility-widget-feature-steps") || "{}",
	);
	if (data[key] === undefined) return -1;
	return data[key];
}

function saveFeatureStep(key, step) {
	const data = JSON.parse(
		localStorage.getItem("accessibility-widget-feature-steps") || "{}",
	);
	data[key] = step;
	localStorage.setItem(
		"accessibility-widget-feature-steps",
		JSON.stringify(data),
	);
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event("accessibility-features-changed"));
	}
}

// --- Contrast Mode Styles ---
function applyContrastMode(stepIndex) {
	const id = "accessibility-widget-style-contrast";
	removeStyle(id);

	const styles = [
		`${BASE_SELECTOR} {
			box-shadow: none !important;
			background-image: none !important;
			text-shadow: none !important;
			background-color: #18181b !important;
		}
		${BASE_SELECTOR}:not(a) { color: #fafafa !important; }
		a:not(.accessibility-widget-link) { color: #facc14 !important; }`,

		`${BASE_SELECTOR} {
			box-shadow: none !important;
			background-image: none !important;
			text-shadow: none !important;
			background-color: #fff !important;
		}
		${BASE_SELECTOR}:not(a) { color: #000 !important; }
		a:not(.accessibility-widget-link) { color: rgb(0, 0, 211) !important; }`,

		`${BASE_SELECTOR} {
			box-shadow: none !important;
			background-image: none !important;
			text-shadow: none !important;
			background-color: #000 !important;
		}
		${BASE_SELECTOR}:not(a) { color: #fff !important; }
		a:not(.accessibility-widget-link) {
			text-decoration: underline !important;
			color: #ffff00 !important;
		}`,
	];

	if (styles[stepIndex]) {
		injectStyle(id, styles[stepIndex]);
	}
}

function handleStepBasedFeature(key, steps, applyFn, removeFn) {
	const current = getFeatureStep(key);
	const next = current === -1 ? 0 : current + 1;

	if (next >= steps.length) {
		removeFn?.();
		saveFeatureStep(key, -1);
		saveActiveFeatures(getActiveFeatures().filter((f) => f !== key));
	} else {
		applyFn(next);
		saveFeatureStep(key, next);
		const active = getActiveFeatures();
		if (!active.includes(key)) {
			saveActiveFeatures([...active, key]);
		}
	}
}

// --- useFeatureToggle Hook ---
export function useFeatureToggle() {
	const [activeFeatures, setActiveFeatures] = useState(getActiveFeatures());
	const [version, setVersion] = useState(0);

	useEffect(() => {
		const active = getActiveFeatures();
		active.forEach((key) => {
			const config = featureConfig[key];
			if (!config) return;

			if (config.type === "style" && key !== "bigCursor") {
				injectStyle(`accessibility-widget-style-${key}`, config.css);
			}

			if (config.type === "js") {
				const step = getFeatureStep(key);
				if (key === "contrast" && step !== -1) applyContrastMode(step);
				if (key === "contentAlignment" && step !== -1) applyContentAlignment(step);
				if (key === "adjustFontSizing" && step !== -1) applyFontSizing(step);
				if (key === "adjustLineHeight" && step !== -1) applyLineHeight(step);
				if (key === "adjustLetterSpacing" && step !== -1) applyLetterSpacing(step);
				if (key === "bigCursor") {
					const s = getFeatureStep("bigCursor");
					if (s !== -1) {
						const sizes = ["sm", "md", "lg"];
						const sizeKey = sizes[s] || "lg";
						try {
							localStorage.setItem("accessibility-widget-bigCursor-size", sizeKey);
						} catch {}
						applyBigCursor(sizeKey);
					}
				}
				if (key === "readingGuide") enableReadingGuide();
			}
		});
	}, []);

	useEffect(() => {
		const handler = () => {
			setActiveFeatures(getActiveFeatures());
			setVersion((v) => v + 1);
		};
		window.addEventListener("accessibility-features-changed", handler);
		return () => {
			window.removeEventListener("accessibility-features-changed", handler);
		};
	}, []);

	const handleToggle = (key) => {
		const config = featureConfig[key];
		if (!config) return;
		if (config.type === "style") {
			const styleId = `accessibility-widget-style-${key}`;
			if (document.getElementById(styleId)) {
				removeStyle(styleId);
				saveActiveFeatures(getActiveFeatures().filter((f) => f !== key));
			} else {
				injectStyle(styleId, config.css);
				saveActiveFeatures([...getActiveFeatures(), key]);
			}
		} else if (config.type === "js" && typeof config.handler === "function") {
			config.handler();
		}
	};

	const isActive = (key) => activeFeatures.includes(key);

	const buttonHandler = (key, action) => {
		// Free features don't use button mode — noop
	};

	const resetAll = () => {
		const activeFeaturesList = getActiveFeatures();
		activeFeaturesList.forEach((key) => {
			const config = featureConfig[key];
			if (config?.type === "style") {
				removeStyle(`accessibility-widget-style-${key}`);
			}
			if (config?.type === "js") {
				switch (key) {
					case "contrast":
						removeStyle("accessibility-widget-style-contrast");
						break;
					case "contentAlignment":
						removeStyle("accessibility-widget-style-contentAlignment");
						break;
					case "adjustFontSizing":
						applyFontSizing(-1);
						break;
					case "adjustLineHeight":
						applyLineHeight(-1);
						break;
					case "adjustLetterSpacing":
						applyLetterSpacing(-1);
						break;
					case "bigCursor":
						removeStyle("accessibility-widget-style-bigCursor");
						try {
							localStorage.removeItem("accessibility-widget-bigCursor-size");
						} catch {}
						break;
					case "readingGuide":
						disableReadingGuide();
						break;
				}
			}
		});
		localStorage.removeItem("accessibility-widget-active-features");
		localStorage.removeItem("accessibility-widget-feature-steps");
		setActiveFeatures([]);
	};

	return {
		handleToggle,
		isActive,
		resetAll,
		getFeatureStep,
		buttonHandler,
		activeFeatures,
		activeProfile: null,
		setActiveProfile: () => {},
		applyProfile: () => {},
		version,
	};
}
