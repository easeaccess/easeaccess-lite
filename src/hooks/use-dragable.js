import { useEffect } from "@wordpress/element";

export function useDraggable(ref, options = {}) {
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (options.disabled) return; // allow runtime disabling

		let isDragging = false;
		let dragStarted = false; // after threshold
		let offsetX = 0;
		let offsetY = 0;
		let startClientX = 0;
		let startClientY = 0;
		const threshold =
			typeof options.threshold === "number" ? options.threshold : 4;

		// Load saved positions (only if persistence enabled)
		let savedX = null;
		let savedY = null;
		if (options.persist !== false) {
			savedX = sessionStorage.getItem("widgetX");
			savedY = sessionStorage.getItem("widgetY");
		}

		// Set initial styles immediately to prevent flash of unstyled content
		el.style.position = "fixed";
		el.style.transition = "none";

		// Apply initial position robustly (on mount and when settings change)
		const applyInitialPosition = () => {
			if (savedX && savedY) {
				el.style.left = savedX;
				el.style.top = savedY;
			} else {
				let applied = false;
				if (typeof options.getInitialPosition === "function") {
					try {
						const pos = options.getInitialPosition(el);
						if (
							pos &&
							typeof pos.left === "number" &&
							typeof pos.top === "number"
						) {
							el.style.top = pos.top + "px";
							el.style.left = pos.left + "px";
							applied = true;
						}
					} catch {}
				}
				if (!applied) {
					const defaultBottom = parseInt(options.defaultBottom || 24);
					const defaultRight = parseInt(options.defaultRight || 24);
					const top = window.innerHeight - el.offsetHeight - defaultBottom;
					const left = window.innerWidth - el.offsetWidth - defaultRight;
					el.style.top = `${top}px`;
					el.style.left = `${left}px`;
				}
				if (options.persist !== false) {
					sessionStorage.setItem("widgetX", el.style.left);
					sessionStorage.setItem("widgetY", el.style.top);
				}
			}
		};
		applyInitialPosition();

		// Mouse events
		const onMouseDown = (e) => {
			if (e.button !== 0) return;
			isDragging = true;
			dragStarted = false;
			startClientX = e.clientX;
			startClientY = e.clientY;
			offsetX = e.clientX - el.getBoundingClientRect().left;
			offsetY = e.clientY - el.getBoundingClientRect().top;
			el.classList.add("a11y-widget-dragging");
			document.body.style.userSelect = "none";
		};

		// Touch events
		const onTouchStart = (e) => {
			if (e.touches.length !== 1) return;
			isDragging = true;
			dragStarted = false;
			startClientX = e.touches[0].clientX;
			startClientY = e.touches[0].clientY;
			offsetX = e.touches[0].clientX - el.getBoundingClientRect().left;
			offsetY = e.touches[0].clientY - el.getBoundingClientRect().top;
			el.classList.add("a11y-widget-dragging");
			document.body.style.userSelect = "none";
		};

		const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

		const onMouseMove = (e) => {
			if (!isDragging) return;
			const dx = e.clientX - startClientX;
			const dy = e.clientY - startClientY;
			if (!dragStarted && Math.hypot(dx, dy) >= threshold) {
				dragStarted = true;
			}
			if (!dragStarted) return;
			const rect = el.getBoundingClientRect();
			const xRaw = e.clientX - offsetX;
			const yRaw = e.clientY - offsetY;
			const maxLeft = window.innerWidth - rect.width;
			const maxTop = window.innerHeight - rect.height;
			const x = clamp(xRaw, 0, maxLeft);
			const y = clamp(yRaw, 0, maxTop);
			el.style.left = `${x}px`;
			el.style.top = `${y}px`;
		};

		const onTouchMove = (e) => {
			if (!isDragging || e.touches.length !== 1) return;
			const dx = e.touches[0].clientX - startClientX;
			const dy = e.touches[0].clientY - startClientY;
			if (!dragStarted && Math.hypot(dx, dy) >= threshold) {
				dragStarted = true;
			}
			if (!dragStarted) return;
			const rect = el.getBoundingClientRect();
			const xRaw = e.touches[0].clientX - offsetX;
			const yRaw = e.touches[0].clientY - offsetY;
			const maxLeft = window.innerWidth - rect.width;
			const maxTop = window.innerHeight - rect.height;
			const x = clamp(xRaw, 0, maxLeft);
			const y = clamp(yRaw, 0, maxTop);
			el.style.left = `${x}px`;
			el.style.top = `${y}px`;
		};

		const onMouseUp = (e) => {
			if (!isDragging) return;
			isDragging = false;
			document.body.style.userSelect = "";
			el.classList.remove("a11y-widget-dragging");
			if (dragStarted) {
				const suppress = (ev) => {
					ev.stopPropagation();
					ev.preventDefault();
				};
				document.addEventListener("click", suppress, true);
				setTimeout(
					() => document.removeEventListener("click", suppress, true),
					0,
				);
			}
			if (dragStarted && typeof options.onDragEnd === "function") {
				options.onDragEnd({ left: el.style.left, top: el.style.top });
			}
			dragStarted = false;
			if (options.persist !== false) {
				sessionStorage.setItem("widgetX", el.style.left);
				sessionStorage.setItem("widgetY", el.style.top);
			}
		};

		const onTouchEnd = (e) => {
			if (!isDragging) return;
			isDragging = false;
			document.body.style.userSelect = "";
			el.classList.remove("a11y-widget-dragging");
			if (dragStarted && typeof options.onDragEnd === "function") {
				options.onDragEnd({ left: el.style.left, top: el.style.top });
			}
			dragStarted = false;
			if (options.persist !== false) {
				sessionStorage.setItem("widgetX", el.style.left);
				sessionStorage.setItem("widgetY", el.style.top);
			}
		};

		const restoreOrClamp = () => {
			const realX =
				options.persist !== false
					? parseInt(sessionStorage.getItem("widgetX") || "0")
					: parseInt(el.style.left || "0");
			const realY =
				options.persist !== false
					? parseInt(sessionStorage.getItem("widgetY") || "0")
					: parseInt(el.style.top || "0");

			const rect = el.getBoundingClientRect();
			const maxLeft = window.innerWidth - rect.width;
			const maxTop = window.innerHeight - rect.height;

			// Try restoring saved position
			const left = Math.max(0, Math.min(realX, maxLeft));
			const top = Math.max(0, Math.min(realY, maxTop));

			el.style.left = `${left}px`;
			el.style.top = `${top}px`;
		};

		window.addEventListener("resize", restoreOrClamp);
		el.addEventListener("mousedown", onMouseDown);
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		// Touch events
		el.addEventListener("touchstart", onTouchStart, { passive: false });
		document.addEventListener("touchmove", onTouchMove, { passive: false });
		document.addEventListener("touchend", onTouchEnd, { passive: false });

		return () => {
			window.removeEventListener("resize", restoreOrClamp);
			el.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			el.removeEventListener("touchstart", onTouchStart);
			document.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("touchend", onTouchEnd);
			document.body.style.userSelect = "";
		};
		// Add options.disabled to dependencies so effect reruns when draggableEnabled changes
	}, [ref, options, options.disabled]);
}
