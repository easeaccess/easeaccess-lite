import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import {
	getInitialButtonPosition,
	getInitialButtonPositionMobile,
	getInitialColor,
} from "@/lib/utils";

export default function useWidget() {
	const [settings, setSettings] = useState(() => {
		// Attempt to hydrate from localStorage svgSettings to avoid flicker
		let persisted = null;
		if (typeof window !== "undefined") {
			try {
				persisted = JSON.parse(localStorage.getItem("svgSettings"));
			} catch {
				/* ignore */
			}
		}
		return {
			svgSettings: {
				// Align defaults with admin use-settings hook
				customSvg: null,
				processedSvg: null,
				size: "sm",
				radius: "sm",
				backgroundColor: getInitialColor(),
				buttonLabel: "Accessibility",
				labelButtonActive: false,
				defaultLanguage: "en_US",
				showAccessibilityProfile: true,
				bgColor: {
					type: "solid",
					color: getInitialColor(),
				},
				selectedIcon: "Accessibility",
				buttonPosition:
					typeof window !== "undefined"
						? getInitialButtonPosition()
						: "bottom-right",
				buttonPositionMobile:
					typeof window !== "undefined"
						? getInitialButtonPositionMobile()
						: "bottom-right",
				exactPosition: {
					enabled: false,
					horizontalOffset: 0,
					verticalOffset: 0,
					horizontalDirection: "left",
					verticalDirection: "lower",
				},
				enableWidget: true,
				draggableEnabled: false,
				displayMode: "all",
				displayContainerMode: "popover",
				containerTheme: "default",
				includePostTypes: [],
				excludePostTypes: [],
				openKeyboardShortcuts: false,
				hideLogo: false,
				keyboardShortcut: "Alt+Shift+A",
				hideOnDevices: { desktop: false, tablet: false, mobile: false },
				clickSpark: {
					color: "#155eef",
					size: 10,
					radius: 60,
					count: 8,
					duration: 500,
					scale: 1,
					easing: "ease-out",
				},
				imageTrails: {
					images: [],
					variant: 1,
				},
				...(persisted || {}), // overlay persisted (safe keys)
			},
			features: [],
			statementSettings: {},
		};
	});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchSettings() {
			try {
				const data = await apiFetch({ path: "/easeaccess-lite/v1/widget-settings" });

				// Get statement settings from the public endpoint
				let statementSettings = {};
				if (data?.statementSettings && data.statementSettings.widget_enabled) {
					statementSettings = data.statementSettings;
				}

				setSettings((prev) => {
						const mergedSvg = {
							...prev.svgSettings,
							...(data?.svgSettings || {}),
							displayContainerMode:
								data?.svgSettings?.displayContainerMode ||
								prev.svgSettings.displayContainerMode ||
								"popover",
							buttonLabel:
								data?.svgSettings?.buttonLabel ||
								prev.svgSettings.buttonLabel ||
								"Accessibility",
							labelButtonActive:
								data?.svgSettings?.labelButtonActive ??
								prev.svgSettings.labelButtonActive ??
								false,
							defaultLanguage:
								data?.svgSettings?.defaultLanguage ||
								prev.svgSettings.defaultLanguage ||
								"en_US",
							showAccessibilityProfile:
								data?.svgSettings?.showAccessibilityProfile ??
								prev.svgSettings.showAccessibilityProfile ??
								true,
						};

						// Sync admin-configured settings to localStorage so all
						// visitors (not just the admin) see the customised values.
						// localStorage acts as a fast cache; the DB is the source of truth.
						try {
							localStorage.setItem("svgSettings", JSON.stringify(mergedSvg));
							if (mergedSvg.clickSpark) {
								localStorage.setItem(
									"accessibility-widget-clickSpark-settings",
									JSON.stringify(mergedSvg.clickSpark),
								);
							}
							if (mergedSvg.imageTrails) {
								localStorage.setItem(
									"accessibility-widget-imageTrails-settings",
									JSON.stringify(mergedSvg.imageTrails),
								);
							}
						} catch {}

						return {
							svgSettings: mergedSvg,
							features: Array.isArray(data?.features) ? data.features : [],
							statementSettings,
						};
					});
			} catch (e) {
				console.error("Failed to fetch frontend settings", e);
			} finally {
				setIsLoading(false);
			}
		}

		fetchSettings();
	}, []);

	// Helper to check if statement is enabled in widget
	const isStatementEnabledInWidget = () => {
		return (
			settings.statementSettings?.widget_enabled &&
			settings.statementSettings?.page_url
		);
	};

	// Get statement link data for widget
	const getStatementLinkData = () => {
		if (!isStatementEnabledInWidget()) return null;

		return {
			url: settings.statementSettings.page_url,
			text: settings.statementSettings.link_text || "Accessibility Statement",
			enabled: settings.statementSettings.widget_enabled,
		};
	};

	return {
		...settings,
		isLoading,
		isStatementEnabledInWidget,
		getStatementLinkData,
	};
}
