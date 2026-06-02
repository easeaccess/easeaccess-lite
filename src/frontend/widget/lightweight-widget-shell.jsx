import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "@wordpress/element";
import { useMediaQuery } from "@wordpress/compose";
import WidgetContext from "@/context/widget-context";
import { cn, getContrastTextColor } from "@/lib/utils";
import { useDraggable } from "@/hooks/use-dragable";
import LightweightWidgetTrigger from "./components/lightweight-widget-trigger";

const hasPersistedActiveFeatures = () => {
	if (typeof window === "undefined") return false;

	try {
		const raw = localStorage.getItem("accessibility-widget-active-features");
		const active = JSON.parse(raw || "[]");
		return Array.isArray(active) && active.length > 0;
	} catch {
		return false;
	}
};

const matchesKeyboardShortcut = (event, shortcut) => {
	if (!shortcut) return false;

	const descriptor = shortcut.split("+").map((part) => part.trim().toLowerCase());
	const need = {
		ctrl: descriptor.includes("ctrl") || descriptor.includes("control"),
		alt: descriptor.includes("alt"),
		shift: descriptor.includes("shift"),
		meta:
			descriptor.includes("meta") ||
			descriptor.includes("cmd") ||
			descriptor.includes("command"),
	};
	const mainKey = descriptor
		.filter(
			(part) =>
				![
					"ctrl",
					"control",
					"alt",
					"shift",
					"meta",
					"cmd",
					"command",
				].includes(part),
		)
		.pop();

	if (need.ctrl && !event.ctrlKey) return false;
	if (need.alt && !event.altKey) return false;
	if (need.shift && !event.shiftKey) return false;
	if (need.meta && !event.metaKey) return false;
	if (!need.ctrl && event.ctrlKey) return false;
	if (!need.alt && event.altKey) return false;
	if (!need.shift && event.shiftKey) return false;
	if (!need.meta && event.metaKey) return false;

	const key = event.key.toLowerCase() === " " ? "space" : event.key.toLowerCase();
	return !mainKey || key === mainKey;
};

export default function LightweightWidgetShell() {
	const widgetRef = useRef(null);
	const loadingFullWidget = useRef(false);
	const [FullWidgetApp, setFullWidgetApp] = useState(null);
	const [initialOpen, setInitialOpen] = useState(false);

	const { svgSettings = {}, isLoading } = useContext(WidgetContext) || {};
	const isMobile = useMediaQuery("(max-width: 768px)");
	const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

	const loadFullWidget = useCallback(
		(openAfterLoad = false) => {
			if (openAfterLoad) setInitialOpen(true);
			if (FullWidgetApp || loadingFullWidget.current) return;

			loadingFullWidget.current = true;
			import(/* webpackChunkName: "frontend-widget-app" */ "./app")
				.then((module) => {
					setFullWidgetApp(() => module.default);
				})
				.catch((error) => {
					console.error("EaseAccess widget panel failed to load", error);
					loadingFullWidget.current = false;
				});
		},
		[FullWidgetApp],
	);

	useEffect(() => {
		if (hasPersistedActiveFeatures()) {
			loadFullWidget(false);
		}
	}, [loadFullWidget]);

	useEffect(() => {
		if (!svgSettings.openKeyboardShortcuts || !svgSettings.keyboardShortcut) {
			return;
		}

		const handler = (event) => {
			if (!matchesKeyboardShortcut(event, svgSettings.keyboardShortcut)) return;
			event.preventDefault();
			loadFullWidget(true);
		};

		document.addEventListener("keydown", handler);

		return () => {
			document.removeEventListener("keydown", handler);
		};
	}, [
		loadFullWidget,
		svgSettings.keyboardShortcut,
		svgSettings.openKeyboardShortcuts,
	]);

	const iconForegroundColor = svgSettings?.bgColor?.color
		? getContrastTextColor(svgSettings.bgColor.color)
		: "#FFFFFF";

	useEffect(() => {
		if (typeof document !== "undefined" && svgSettings?.bgColor?.color) {
			const root = document.documentElement;
			root.style.setProperty("--primary-icon", svgSettings.bgColor.color);
			root.style.setProperty("--primary-icon-foreground", iconForegroundColor);
		}
	}, [svgSettings?.bgColor?.color, iconForegroundColor]);

	const deviceKey = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";
	const hiddenOnDevice = !!svgSettings?.hideOnDevices?.[deviceKey];

	const dragOptions = useMemo(
		() => ({
			defaultBottom: 24,
			defaultRight: 24,
			disabled: !svgSettings?.draggableEnabled,
			persist: svgSettings?.draggableEnabled ? true : false,
			getInitialPosition: (element) => {
				const position = isMobile
					? svgSettings?.buttonPositionMobile || "bottom-right"
					: svgSettings?.buttonPosition || "bottom-right";
				const margin = 24;
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				const width = element.offsetWidth;
				const height = element.offsetHeight;
				const centers = {
					left: margin,
					right: vw - width - margin,
					vcenter: (vw - width) / 2,
					th: margin,
					bh: vh - height - margin,
					vMiddle: (vh - height) / 2,
				};

				switch (position) {
					case "bottom-right":
						return { top: centers.bh, left: centers.right };
					case "bottom-left":
						return { top: centers.bh, left: centers.left };
					case "top-right":
						return { top: centers.th, left: centers.right };
					case "top-left":
						return { top: centers.th, left: centers.left };
					case "center-right":
						return { top: centers.vMiddle, left: centers.right };
					case "center-left":
						return { top: centers.vMiddle, left: centers.left };
					case "top-center":
						return { top: centers.th, left: centers.vcenter };
					case "bottom-center":
						return { top: centers.bh, left: centers.vcenter };
					default:
						return { top: centers.bh, left: centers.right };
				}
			},
			_settingsKey: JSON.stringify(svgSettings),
		}),
		[
			isMobile,
			svgSettings,
			svgSettings?.buttonPosition,
			svgSettings?.buttonPositionMobile,
			svgSettings?.draggableEnabled,
		],
	);

	useDraggable(widgetRef, dragOptions);

	if (FullWidgetApp) {
		return <FullWidgetApp initialOpen={initialOpen} />;
	}

	if (isLoading) return null;
	if (svgSettings && svgSettings.enableWidget === false) return null;
	if (hiddenOnDevice) return null;
	if (svgSettings && svgSettings.navMode === true) return null;

	return (
		<div
			className={cn(
				"accessibility-widget-ready zn:fixed zn:z-[99999] zn:!font-sans",
				!svgSettings?.draggableEnabled &&
					(() => {
						const position = isMobile
							? svgSettings?.buttonPositionMobile || "bottom-right"
							: svgSettings?.buttonPosition || "bottom-right";
						return {
							"zn:bottom-6 zn:end-6": position === "bottom-right",
							"zn:bottom-6 zn:start-6": position === "bottom-left",
							"zn:top-6 zn:end-6": position === "top-right",
							"zn:top-6 zn:start-6": position === "top-left",
							"zn:top-1/2 zn:-translate-y-1/2 zn:end-6":
								position === "center-right",
							"zn:top-1/2 zn:-translate-y-1/2 zn:start-6":
								position === "center-left",
							"zn:top-6 zn:-translate-x-1/2 zn:start-1/2":
								position === "top-center",
							"zn:bottom-6 zn:-translate-x-1/2 zn:start-1/2":
								position === "bottom-center",
						};
					})(),
			)}
			ref={svgSettings?.draggableEnabled ? widgetRef : null}
			id="accessibility-widget"
		>
			<LightweightWidgetTrigger
				svgSettings={svgSettings}
				onClick={() => loadFullWidget(true)}
			/>
		</div>
	);
}
