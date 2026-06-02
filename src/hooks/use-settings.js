import { useState, useEffect, useRef } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { toast } from "sonner";
import {
	processSvgForColoring,
	getInitialColor,
	getInitialButtonPosition,
	getInitialButtonPositionMobile,
	getContrastTextColor,
} from "../lib/utils";
import { appConfig } from "../config/app.confing";
import { enrichFeatures } from "../constant/settings";
// Helper to enrich DEFAULT_FEATURES with enabled flags

export default function useSettings() {
	const [features, setFeatures] = useState(() => enrichFeatures([]));
	const [svgSettings, setSvgSettings] = useState({
		customSvg: null,
		processedSvg: null,
		size: "sm",
		radius: "sm",
		backgroundColor: getInitialColor(),
		selectedIcon: "Accessibility",
		buttonLabel: "Accessibility", // new dynamic button text
		labelButtonActive: false, // controls showing the button label input
		defaultLanguage: "en_US",
		showAccessibilityProfile: true, // toggle for AccessibilityProfile component frontend
		bgColor: {
			type: "solid",
			color: getInitialColor(),
		},
		buttonPosition: getInitialButtonPosition(),
		buttonPositionMobile: getInitialButtonPositionMobile(),
		exactPosition: appConfig.svgSettings.exactPosition,
		enableWidget: appConfig.enableWidget,
		draggableEnabled: false,
		// New 2025-09-11: control container type (popover | sheet)
		displayContainerMode: "popover",
		// New: display conditions (mode: 'include' | 'exclude' | 'all') and arrays of post types
		displayMode: "all",
		includePostTypes: [],
		excludePostTypes: [],
		// New settings added 2025-08-31
		openKeyboardShortcuts: false, // enable opening widget with Alt+Shift+A
		hideLogo: false, // hide branding in frontend widget footer
		keyboardShortcut: "Alt+Shift+A", // editable keyboard shortcut descriptor
		hideOnDevices: { desktop: false, tablet: false, mobile: false }, // hide widget entirely per device
		// Click Spark customizable settings (admin controlled)
		clickSpark: {
			color: "#155eef",
			size: 10,
			radius: 60,
			count: 8,
			duration: 500,
			scale: 1,
			easing: "ease-out",
		},
		// Image Trails settings
		imageTrails: {
			images: [
				"https://picsum.photos/id/287/300/300",
				"https://picsum.photos/id/1001/300/300",
				"https://picsum.photos/id/1025/300/300",
				"https://picsum.photos/id/1026/300/300",
				"https://picsum.photos/id/1027/300/300",
				"https://picsum.photos/id/1028/300/300",
				"https://picsum.photos/id/1029/300/300",
				"https://picsum.photos/id/1028/300/300",
			],
			variant: 1,
		},
	});
	const [isSaving, setIsSaving] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Track if user changed anything
	const hasUserChanged = useRef(false);

	// Wrap state setters to detect changes
	const wrappedSetFeatures = (val) => {
		hasUserChanged.current = true;
		setFeatures(val);
	};

	const wrappedSetSvgSettings = (updater) => {
		hasUserChanged.current = true;
		setSvgSettings(updater);
	};

	useEffect(() => {
		if (svgSettings?.customSvg) {
			const processed = processSvgForColoring(
				svgSettings.customSvg,
				svgSettings.size,
				svgSettings.radius,
			);
			setSvgSettings((prev) => ({ ...prev, processedSvg: processed }));
		}
	}, [svgSettings.customSvg, svgSettings.size, svgSettings.radius]);

	const loadSettings = async () => {
		setIsLoading(true);
		try {
			const response = await apiFetch({ path: "/easeaccess-lite/v1/settings" });
			//setFeatures(response.features || []);
			const enabledKeys = response.features || [];
			setFeatures(enrichFeatures(enabledKeys));

			const loadedSettings = response.svgSettings || {};

			setSvgSettings((prev) => ({
				...prev,
				...loadedSettings,
				displayContainerMode:
					loadedSettings.displayContainerMode ||
					prev.displayContainerMode ||
					"popover",
				buttonLabel:
					loadedSettings.buttonLabel || prev.buttonLabel || "Accessibility",
				labelButtonActive:
					loadedSettings.labelButtonActive ?? prev.labelButtonActive ?? false,
				showAccessibilityProfile:
					loadedSettings.showAccessibilityProfile ??
					prev.showAccessibilityProfile ??
					true,
				defaultLanguage:
					loadedSettings.defaultLanguage || prev.defaultLanguage || "en_US",
				keyboardShortcut:
					loadedSettings.keyboardShortcut ||
					prev.keyboardShortcut ||
					"Alt+Shift+A",
				hideOnDevices: {
					desktop:
						loadedSettings?.hideOnDevices?.desktop ??
						prev.hideOnDevices?.desktop ??
						false,
					tablet:
						loadedSettings?.hideOnDevices?.tablet ??
						prev.hideOnDevices?.tablet ??
						false,
					mobile:
						loadedSettings?.hideOnDevices?.mobile ??
						prev.hideOnDevices?.mobile ??
						false,
				},
				clickSpark: {
					...prev.clickSpark,
					...(loadedSettings?.clickSpark || {}),
				},
				imageTrails: {
					...prev.imageTrails,
					...(loadedSettings?.imageTrails || {}),
				},
			}));

			// Reset change flag on load
			hasUserChanged.current = false;
		} catch (error) {
			console.error("Failed to load settings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const saveSettings = async () => {
		// if (
		// 	!svgSettings.exactPosition.enabled &&
		// 	(svgSettings.exactPosition.horizontalOffset !== 0 ||
		// 		svgSettings.exactPosition.verticalOffset !== 0 ||
		// 		svgSettings.exactPosition.horizontalDirection !== "left" ||
		// 		svgSettings.exactPosition.verticalDirection !== "lower")
		// ) {
		// 	toast.error("Exact positioning is disabled — you can't save offsets.");
		// 	return;
		// }
		setIsSaving(true);
		try {
			const response = await apiFetch({
				path: "/easeaccess-lite/v1/settings",
				method: "POST",
				data: {
					features,
					svgSettings,
				},
			});

			if (response?.success) {
				toast.success("Settings saved successfully!");

				hasUserChanged.current = false; // Reset flag after save
			} else {
				toast.warning("Saved, but no confirmation received.");
			}
		} catch (error) {
			console.error("Failed to save settings:", error);
		} finally {
			setIsSaving(false);
		}
	};

	useEffect(() => {
		loadSettings();
	}, []);
	useEffect(() => {
		if (svgSettings?.bgColor.color) {
			document.documentElement.style.setProperty(
				"--primary-icon",
				svgSettings.bgColor.color,
			);
			document.documentElement.style.setProperty(
				"--primary-icon-foreground",
				getContrastTextColor(svgSettings.bgColor.color),
			);
		}
		// Save entire svgSettings to localStorage for frontend access
		localStorage.setItem("svgSettings", JSON.stringify(svgSettings));
	}, [svgSettings]);

	return {
		features,
		setFeatures: wrappedSetFeatures,
		svgSettings,
		setSvgSettings: wrappedSetSvgSettings,
		isSaving,
		isLoading,
		loadSettings,
		saveSettings,
		hasChanges: hasUserChanged.current,
	};
}
