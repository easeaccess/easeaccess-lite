import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { appConfig } from "../config/app.confing";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const processSvgForColoring = (svgContent, color, size) => {
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = svgContent;
	const svgElement = tempDiv.querySelector("svg");

	if (svgElement) {
		const uniqueId = `svg-${Date.now()}-${Math.random()
			.toString(36)
			.substr(2, 9)}`;
		svgElement.setAttribute("id", uniqueId);
		svgElement.setAttribute("width", size.toString());
		svgElement.setAttribute("height", size.toString());

		if (!svgElement.getAttribute("viewBox")) {
			const originalWidth = svgElement.getAttribute("width") || "24";
			const originalHeight = svgElement.getAttribute("height") || "24";
			svgElement.setAttribute(
				"viewBox",
				`0 0 ${originalWidth} ${originalHeight}`,
			);
		}

		// Check if SVG uses currentColor or stroke-based styling
		const hasCurrentColor = svgContent.includes("currentColor");
		const hasStrokeOnly =
			svgContent.includes('fill="none"') && svgContent.includes("stroke");
		const isLucideIcon = svgContent.includes("lucide");

		// Handle different SVG types differently
		if (hasCurrentColor || hasStrokeOnly || isLucideIcon) {
			// For SVGs that use currentColor or are stroke-based (like Lucide icons)
			// Just set the color and size without removing attributes
			svgElement.style.color = color;
			svgElement.style.width = `${size}px`;
			svgElement.style.height = `${size}px`;

			// Add CSS to ensure proper coloring
			const style = document.createElement("style");
			style.textContent = `
				#${uniqueId} {
					width: ${size}px !important;
					height: ${size}px !important;
					display: block;
					color: ${color};
				}
				#${uniqueId}[stroke="currentColor"], 
				#${uniqueId} *[stroke="currentColor"] {
					stroke: ${color};
				}
				#${uniqueId}[fill="currentColor"], 
				#${uniqueId} *[fill="currentColor"] {
					fill: ${color};
				}
			`;
			svgElement.insertBefore(style, svgElement.firstChild);
		} else {
			// For other SVGs, use the original aggressive approach
			const elementsToColor = svgElement.querySelectorAll("*");

			elementsToColor.forEach((el) => {
				const currentFill = el.getAttribute("fill");
				if (
					currentFill &&
					currentFill !== "none" &&
					currentFill !== "transparent" &&
					currentFill !== "currentColor"
				) {
					el.removeAttribute("fill");
				}

				const currentStroke = el.getAttribute("stroke");
				if (
					currentStroke &&
					currentStroke !== "none" &&
					currentStroke !== "transparent" &&
					currentStroke !== "currentColor"
				) {
					el.removeAttribute("stroke");
				}

				const style = el.getAttribute("style");
				if (style) {
					const cleaned = style
						.replace(
							/fill\s*:\s*(?!currentColor|none|transparent)[^;]+;?/gi,
							"",
						)
						.replace(
							/stroke\s*:\s*(?!currentColor|none|transparent)[^;]+;?/gi,
							"",
						)
						.replace(/width\s*:\s*[^;]+;?/gi, "")
						.replace(/height\s*:\s*[^;]+;?/gi, "")
						.trim();
					if (cleaned) el.setAttribute("style", cleaned);
					else el.removeAttribute("style");
				}
			});

			const style = document.createElement("style");
			style.textContent = `
				#${uniqueId} {
					width: ${size}px !important;
					height: ${size}px !important;
					display: block;
				}
				#${uniqueId} * {
					fill: ${color};
					color: ${color};
				}
			`;
			svgElement.insertBefore(style, svgElement.firstChild);
			svgElement.setAttribute("fill", "currentColor");
			svgElement.style.color = color;
			svgElement.style.width = `${size}px`;
			svgElement.style.height = `${size}px`;
		}

		return tempDiv.innerHTML;
	}

	return svgContent;
};
export const getInitialColor = () => {
	const defaultColor = appConfig.iconPrimaryColor;
	if (typeof window === "undefined") return defaultColor;

	try {
		// Prefer unified svgSettings storage (new) then fall back to legacy key
		let savedColor = null;
		const raw = localStorage.getItem("svgSettings");
		if (raw) {
			try {
				const parsed = JSON.parse(raw);
				savedColor = parsed?.bgColor?.color || parsed?.backgroundColor || null;
			} catch {
				/* ignore parse error */
			}
		}
		if (!savedColor) {
			// Legacy single key fallback
			savedColor = localStorage.getItem("primary-icon-color");
		}
		const final = savedColor || defaultColor;
		document.documentElement.style.setProperty("--primary-icon", final);
		return final;
	} catch {
		return defaultColor;
	}
};

export const getInitialButtonPosition = () => {
	const defaultPosition = appConfig.svgSettings.buttonPosition;
	if (typeof window === "undefined") return defaultPosition;

	try {
		let saved = null;
		const raw = localStorage.getItem("svgSettings");
		if (raw) {
			try {
				const parsed = JSON.parse(raw);
				saved = parsed?.buttonPosition || null;
			} catch {
				/* ignore */
			}
		}
		if (!saved) {
			// Legacy key
			saved = localStorage.getItem("button-position-desktop");
		}
		return saved || defaultPosition;
	} catch {
		return defaultPosition;
	}
};
export const getInitialButtonPositionMobile = () => {
	const defaultPosition = appConfig.svgSettings.buttonPositionMobile;
	if (typeof window === "undefined") return defaultPosition;

	try {
		let saved = null;
		const raw = localStorage.getItem("svgSettings");
		if (raw) {
			try {
				const parsed = JSON.parse(raw);
				saved = parsed?.buttonPositionMobile || null;
			} catch {
				/* ignore */
			}
		}
		if (!saved) {
			saved = localStorage.getItem("button-position-mobile");
		}
		return saved || defaultPosition;
	} catch {
		return defaultPosition;
	}
};
export function hexToRgb(hex) {
	if (!hex || typeof hex !== "string") return { r: 0, g: 0, b: 0 }; // Fallback to black

	hex = hex.replace("#", "");

	if (hex.length === 3) {
		hex = hex
			.split("")
			.map((char) => char + char)
			.join("");
	}

	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	return { r, g, b };
}

export function getContrastTextColor(hexColor) {
	const { r, g, b } = hexToRgb(hexColor);
	// Calculate luminance (YIQ method for perceived brightness)
	// A common threshold for switching between black and white text is around 128.
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? "#000000" : "#FFFFFF";
}
// accessibilityProfile data moved to lib/accessibility-profiles-data.js
// (so lite builds can exclude pro-only profile presets via webpack alias).
