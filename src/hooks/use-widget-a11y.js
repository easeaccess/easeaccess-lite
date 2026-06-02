import { useEffect, useRef, useCallback } from "@wordpress/element";

/**
 * Centralized accessibility behaviors for the EaseAccess floating widget.
 *
 * Returns refs/handlers to wire onto the widget panel:
 *   - panelRef:        ref to attach to the open dialog/panel root
 *   - triggerRef:      ref to attach to the floating trigger button
 *   - announce(msg):   send a polite announcement to assistive tech
 *
 * Behaviors when `open` is true:
 *   1. Focus moves to the first focusable element inside the panel.
 *   2. Tab / Shift+Tab is trapped within the panel.
 *   3. Escape closes the panel via `onClose`.
 *   4. When the panel closes, focus is restored to the trigger button.
 *   5. A visually-hidden aria-live region is appended to <body> so feature
 *      changes (profile activated, language changed, etc.) can be announced.
 */
export default function useWidgetA11y({ open, onClose }) {
	const panelRef = useRef(null);
	const triggerRef = useRef(null);
	const lastFocusedRef = useRef(null);
	const liveRegionRef = useRef(null);

	/* ------------------------------------------------------------------ */
	/* Live region (singleton on <body>)                                  */
	/* ------------------------------------------------------------------ */
	useEffect(() => {
		if (typeof document === "undefined") return;
		let region = document.getElementById("easeaccess-live-region");
		if (!region) {
			region = document.createElement("div");
			region.id = "easeaccess-live-region";
			region.setAttribute("aria-live", "polite");
			region.setAttribute("aria-atomic", "true");
			region.setAttribute("role", "status");
			// Visually hidden but available to AT.
			region.style.cssText =
				"position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;";
			document.body.appendChild(region);
		}
		liveRegionRef.current = region;
	}, []);

	const announce = useCallback((message) => {
		const region = liveRegionRef.current;
		if (!region || !message) return;
		// Reset to force AT to re-announce identical messages.
		region.textContent = "";
		// Microtask delay so screen readers pick up the change.
		setTimeout(() => {
			region.textContent = String(message);
		}, 30);
	}, []);

	/* ------------------------------------------------------------------ */
	/* Focus management + Esc + Tab trap                                  */
	/* ------------------------------------------------------------------ */
	useEffect(() => {
		if (!open) return;

		// Remember what was focused before opening.
		lastFocusedRef.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;

		const panel = panelRef.current;
		if (!panel) return;

		const getFocusable = () =>
			Array.from(
				panel.querySelectorAll(
					'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
				),
			).filter(
				(el) =>
					!el.hasAttribute("disabled") &&
					!el.getAttribute("aria-hidden") &&
					el.offsetParent !== null,
			);

		// Move focus inside.
		requestAnimationFrame(() => {
			const focusable = getFocusable();
			if (focusable.length > 0) {
				focusable[0].focus();
			} else {
				// Make panel itself focusable as fallback.
				panel.setAttribute("tabindex", "-1");
				panel.focus();
			}
		});

		const handleKeyDown = (e) => {
			if (e.key === "Escape" || e.keyCode === 27) {
				e.stopPropagation();
				onClose?.();
				return;
			}
			if (e.key !== "Tab") return;

			const focusable = getFocusable();
			if (focusable.length === 0) {
				e.preventDefault();
				return;
			}
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			const active = document.activeElement;

			if (e.shiftKey && active === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && active === last) {
				e.preventDefault();
				first.focus();
			} else if (!panel.contains(active)) {
				// Focus escaped — pull it back.
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown, true);
		return () => {
			document.removeEventListener("keydown", handleKeyDown, true);
		};
	}, [open, onClose]);

	/* ------------------------------------------------------------------ */
	/* Restore focus on close                                             */
	/* ------------------------------------------------------------------ */
	useEffect(() => {
		if (open) return;
		const target = triggerRef.current || lastFocusedRef.current;
		if (target && typeof target.focus === "function") {
			// Defer so the panel is fully removed first.
			setTimeout(() => target.focus(), 0);
		}
	}, [open]);

	return { panelRef, triggerRef, announce };
}
