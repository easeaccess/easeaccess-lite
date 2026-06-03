// Clean refactored implementation (final)
import "../../admin/custom.css";
import {
	useEffect,
	useState,
	useRef,
	useContext,
	useMemo,
} from "@wordpress/element";
import { useMediaQuery } from "@wordpress/compose";
import WidgetContext from "@/context/widget-context";
import { cn, getContrastTextColor } from "@/lib/utils";
import { isRenderableComponent } from "@/lib/react-component";
import { useFeatureToggle } from "@/hooks/use-feayure-toggle";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { sounds } from "@/lib/sound";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDraggable } from "@/hooks/use-dragable";
import { useTranslation } from "@/hooks/use-translation";
import DictionaryModal from "@/components/dictionary-modal";
import { Toaster } from "@/components/ui/sonner";
import { useLicense } from "@/context/license-context";
import { PREMIUM_FEATURE_KEYS } from "@/constant/premium-features";
import { DEFAULT_FEATURES } from "@/constant/settings";
import AccessibilityProfile from "./components/accessibility-profile";
import WidgetHeader from "./components/widget-header";
import WidgetIntro from "./components/widget-intro";
import FeatureGroup from "./components/feature-group";
import PageStructureView from "./components/page-structure-view";
import { isPremiumFeature } from "@/constant/premium-features";
import AnimatedToggleSwitch from "@/components/animated-switch";
import WidgetTrigger from "./components/widget-trigger";
import WidgetFooter from "./components/widget-footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const hydrateFeaturesForWidget = (features = []) => {
	// Lite: build a strict allowlist of feature keys + group titles that this
	// build supports. Anything outside this allowlist (e.g. Pro features left
	// in the saved option from a previous Pro install) is silently dropped.
	const defaultsByKey = new Map();
	const liteKeys = new Set();
	const liteTitles = new Set();
	DEFAULT_FEATURES.forEach((group) => {
		liteTitles.add(group.title);
		(group.settings || []).forEach((setting) => {
			defaultsByKey.set(setting.key, setting);
			liteKeys.add(setting.key);
		});
	});

	const sourceFeatures =
		Array.isArray(features) && features.length ? features : DEFAULT_FEATURES;

	// Restrict the saved source to groups + settings that exist in Lite.
	const filteredSource = sourceFeatures
		.filter((group) => liteTitles.has(group.title))
		.map((group) => ({
			...group,
			settings: (group.settings || []).filter((s) => liteKeys.has(s.key)),
		}));

	const presentKeys = new Set();
	filteredSource.forEach((group) => {
		(group.settings || []).forEach((s) => presentKeys.add(s.key));
	});

	const sourceTitles = new Set(filteredSource.map((g) => g.title));
	const merged = filteredSource.map((group) => {
		const defaultGroup =
			DEFAULT_FEATURES.find((g) => g.title === group.title) || {};
		const missing = (defaultGroup.settings || []).filter(
			(s) => !presentKeys.has(s.key),
		);
		return { ...group, settings: [...(group.settings || []), ...missing] };
	});
	DEFAULT_FEATURES.forEach((group) => {
		if (!sourceTitles.has(group.title)) merged.push(group);
	});

	return merged.map((group) => ({
		...group,
		settings: (group.settings || []).map((setting) => {
			const defaultSetting = defaultsByKey.get(setting.key) || {};
			const icon = isRenderableComponent(setting.icon)
				? setting.icon
				: defaultSetting.icon;

			return {
				...defaultSetting,
				...setting,
				icon,
				enabled:
					setting.enabled ?? defaultSetting.enabled ?? !isPremiumFeature(setting.key),
				premium: setting.premium ?? isPremiumFeature(setting.key),
			};
		}),
	}));
};

const App = ({ initialOpen = false }) => {
	const { __ } = useTranslation();
	const widgetRef = useRef(null);

	const {
		svgSettings = {},
		features = [],
		isStatementEnabledInWidget,
		getStatementLinkData,
		isLoading,
	} = useContext(WidgetContext) || {};
	const license = useLicense ? useLicense() : null;
	const hasFeature = (label) =>
		license?.hasFeature ? license.hasFeature(label) : true;

	// License-aware feature toggle wrapper
	const handleFeatureToggle = (featureKey) => {
		// Check if it's a premium feature and if license is valid
		if (PREMIUM_FEATURE_KEYS.includes(featureKey)) {
			if (!license?.isValid || !license?.isActivated) {
				console.warn(
					`Premium feature "${featureKey}" requires a valid license`,
				);
				// You could show a toast or modal here to inform the user
				return;
			}
		}
		// If it's not premium or license is valid, proceed with toggle
		handleToggle(featureKey);
	};

	const {
		handleToggle,
		isActive,
		resetAll,
		getFeatureStep,
		buttonHandler,
		activeFeatures,
	} = useFeatureToggle();

	const [open, setOpen] = useState(Boolean(initialOpen));

	useEffect(() => {
		if (initialOpen) setOpen(true);
	}, [initialOpen]);

	// Device detection for hideOnDevices
	const isMobile = useMediaQuery("(max-width: 768px)");
	const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
	let deviceKey = "desktop";
	if (isMobile) deviceKey = "mobile";
	else if (isTablet) deviceKey = "tablet";
	const hiddenOnDevice = !!svgSettings?.hideOnDevices?.[deviceKey];

	// Keyboard shortcut to toggle widget when enabled (customizable)
	useEffect(() => {
		if (!svgSettings.openKeyboardShortcuts || !svgSettings.keyboardShortcut)
			return;
		// Normalize descriptor into parts
		const descriptor = svgSettings.keyboardShortcut
			.split("+")
			.map((p) => p.trim().toLowerCase());
		const need = {
			ctrl: descriptor.includes("ctrl") || descriptor.includes("control"),
			alt: descriptor.includes("alt"),
			shift: descriptor.includes("shift"),
			meta:
				descriptor.includes("meta") ||
				descriptor.includes("cmd") ||
				descriptor.includes("command"),
		};
		// Last non-mod key (e.g., 'a' or 'k')
		const mainKey = descriptor
			.filter(
				(p) =>
					![
						"ctrl",
						"control",
						"alt",
						"shift",
						"meta",
						"cmd",
						"command",
					].includes(p),
			)
			.pop();
		const handler = (e) => {
			if (need.ctrl && !e.ctrlKey) return;
			if (need.alt && !e.altKey) return;
			if (need.shift && !e.shiftKey) return;
			if (need.meta && !e.metaKey) return;
			// Avoid matching when extra modifiers present (except allowed ones)
			if (!need.ctrl && e.ctrlKey) return;
			if (!need.alt && e.altKey) return;
			if (!need.shift && e.shiftKey) return;
			if (!need.meta && e.metaKey) return;
			let key = e.key.toLowerCase();
			if (key === " ") key = "space";
			if (mainKey && key !== mainKey.toLowerCase()) return;
			e.preventDefault();
			setOpen((prev) => !prev);
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [svgSettings.openKeyboardShortcuts, svgSettings.keyboardShortcut]);
	const [showPageStructure, setShowPageStructure] = useState(false);
	const [pageStructureData, setPageStructureData] = useState(null);
	const [activeTab, setActiveTab] = useState("headings");
	const [showDictionary, setShowDictionary] = useState(false);
	const [dictionaryWord, setDictionaryWord] = useState("");
	const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);

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

	const handleDictionaryTextSelection = () => {
		const selection = window.getSelection();
		if (!selection) return;
		const text = selection.toString().trim();
		if (!text) return;
		const words = text
			.replace(/[\n\r]+/g, " ")
			.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ'\-\s]/g, "")
			.split(/\s+/)
			.filter(Boolean);
		if (!words.length) return;
		const cleanedText = words.join(" ");
		if (cleanedText.split(" ").length === 1 && cleanedText.length > 3) {
			setDictionaryWord(cleanedText);
			setShowDictionary(true);
		} else {
			const firstWord = words.find((w) => w.length > 3) || words[0];
			setDictionaryWord(firstWord);
			setShowDictionary(true);
		}
	};

	useEffect(() => {
		const isDictionaryActive = activeFeatures.includes("dictionary");

		// Clean up existing listener first
		document.removeEventListener("mouseup", handleDictionaryTextSelection);

		if (isDictionaryActive) {
			// Add listener when dictionary is active
			document.addEventListener("mouseup", handleDictionaryTextSelection);
		} else {
			// Hide dictionary and clear word when inactive
			setShowDictionary(false);
			setDictionaryWord("");
		}

		// Cleanup function
		return () => {
			document.removeEventListener("mouseup", handleDictionaryTextSelection);
		};
	}, [activeFeatures]);

	// Monitor license status and clean up premium features when license becomes invalid
	useEffect(() => {
		if (license?.initialLoadComplete && !license?.isValid) {
			// License is loaded and invalid, clean up premium features
			if (license?.cleanupPremiumFeatures) {
				license.cleanupPremiumFeatures();
			}
		}
	}, [
		license?.isValid,
		license?.initialLoadComplete,
		license?.cleanupPremiumFeatures,
	]);

	const scrollToElement = (selector) => {
		const el = document.querySelector(selector);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
	};
	const handleHeadingClick = (e, heading) => {
		e.preventDefault();
		e.stopPropagation();
		if (heading.id) return scrollToElement(`#${heading.id}`);
		if (heading.text) {
			const all = document.querySelectorAll(heading.level);
			for (const h of all) {
				if (h.textContent.trim() === heading.text.trim()) {
					h.scrollIntoView({ behavior: "smooth", block: "center" });
					break;
				}
			}
		}
	};
	const handleLandmarkClick = (e, landmark) => {
		e.preventDefault();
		e.stopPropagation();
		let selector = landmark.tag;
		if (landmark.role) selector += `[role='${landmark.role}']`;
		if (landmark.label) selector += `[aria-label='${landmark.label}']`;
		const el = document.querySelector(selector);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
	};

	const hydratedFeatures = useMemo(
		() => hydrateFeaturesForWidget(features),
		[features],
	);

	const filteredFeatures = hydratedFeatures
		.map((group) => ({
			...group,
			settings: (group.settings || []).filter((setting) => {
				if (isPremiumFeature(setting.key) && !hasFeature(setting.label))
					return false;
				return setting.enabled;
			}),
		}))
		.filter((g) => g.settings.length > 0);

	if (svgSettings && svgSettings.enableWidget === false) return null;
	if (hiddenOnDevice) return null; // stop mounting
	if (svgSettings && svgSettings.navMode === true) return null; // Use nav mode instead

	// Stable memoized drag options so opening popover (state changes) won't reset position
	const dragOptions = useMemo(
		() => ({
			defaultBottom: 24,
			defaultRight: 24,
			disabled: !svgSettings?.draggableEnabled,
			persist: svgSettings?.draggableEnabled ? true : false,
			getInitialPosition: (el) => {
				const pos = isMobile
					? svgSettings?.buttonPositionMobile || "bottom-right"
					: svgSettings?.buttonPosition || "bottom-right";
				const margin = 24;
				const vw = window.innerWidth;
				const vh = window.innerHeight;
				const w = el.offsetWidth;
				const h = el.offsetHeight;
				const centers = {
					left: margin,
					right: vw - w - margin,
					vcenter: (vw - w) / 2,
					th: margin,
					bh: vh - h - margin,
					vMiddle: (vh - h) / 2,
				};
				switch (pos) {
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
		}),
		[
			svgSettings?.draggableEnabled,
			svgSettings?.buttonPosition,
			svgSettings?.buttonPositionMobile,
			isMobile,
		],
	);

	// Reapply drag logic whenever svgSettings changes (not just draggableEnabled)
	useDraggable(widgetRef, {
		...dragOptions,
		// Add a key that changes whenever svgSettings changes to force effect rerun
		_settingsKey: JSON.stringify(svgSettings),
	});

	const isPopover = svgSettings?.displayContainerMode === "popover";
	const containerTheme = svgSettings?.containerTheme || "default";
	const sheetSide = useMemo(() => {
		const pos = isMobile
			? svgSettings?.buttonPositionMobile || "bottom-right"
			: svgSettings?.buttonPosition || "bottom-right";
		if (pos.includes("-left")) return "left"; // top-left, bottom-left, center-left
		if (pos.includes("-right")) return "right"; // top-right, bottom-right, center-right
		if (pos === "top-center") return "right";
		if (pos === "bottom-center") return "right";
		return "right";
	}, [
		svgSettings?.buttonPosition,
		svgSettings?.buttonPositionMobile,
		isMobile,
	]);

	if (isLoading) {
		return <div></div>;
	}

	const PanelContent = (
		<>
			<div
				className={cn(
					"zn:!text-primary-icon-foreground zn:rounded-t-md zn:!pb-7 zn:flex-none",

					{
						"zn:!pt-5 zn:!px-4": !isPopover,
						"zn:!pb-0": containerTheme === "default",
						"zn:!pt-4": containerTheme === "default" && !isPopover,
					},
				)}
			>
				{!showPageStructure && !showLanguageSwitcher && (
					<>
						<WidgetHeader
							resetAll={resetAll}
							onClose={() => setOpen(false)}
							theme={containerTheme}
							onLanguageToggle={() => setShowLanguageSwitcher(true)}
						/>
						<WidgetIntro svgSettings={svgSettings} />
					</>
				)}
			</div>
			<ScrollArea
				className={cn(
					" zn:!p-0  zn:!-mt-4 zn:flex-1 zn:h-[calc(100%-120px)] ",

					{
						//"zn:h-[300px]": filteredFeatures.length > 0,
						"zn:!-mx-4": isPopover && containerTheme !== "default",
						"zn:!mx-4": !isPopover && containerTheme === "default",
						"zn:!pb-4": isPopover && containerTheme === "default",

						"zn:h-[calc(100%-320px)]":
							!isMobile && containerTheme === "classic",
						//"zn:overflow-auto": isMobile,
					},
				)}
			>
				{showPageStructure ? (
					<PageStructureView
						data={pageStructureData}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						onBack={() => setShowPageStructure(false)}
						scrollHandlers={{
							onHeading: handleHeadingClick,
							onLandmark: handleLandmarkClick,
						}}
					/>
				) : showLanguageSwitcher ? (
					<LanguageSwitcher
						isOpen={showLanguageSwitcher}
						onBack={() => setShowLanguageSwitcher(false)}
					/>
				) : (
					<div
						className={cn("  zn:!bg-[#F2F4F8]", {
							"zn:rounded-t-[20px] zn:!px-4 zn:!py-5":
								containerTheme === "classic",
							"zn:md:!pb-24 zn:!pb-16 zn:md:!px-6 zn:!px-4 zn:md:!pt-6 zn:!pt-5":
								containerTheme === "default",
						})}
						id="accessibility-widgetc"
					>
						{__EASEACCESS_PRO__ && svgSettings?.showAccessibilityProfile && (
							<AccessibilityProfile theme={containerTheme} />
						)}
						{filteredFeatures.length > 0 ? (
							filteredFeatures.map((featureGroup, index) => (
								<div key={index}>
									<FeatureGroup
										key={featureGroup.title}
										title={featureGroup.title}
										settings={featureGroup.settings}
										isActive={isActive}
										handleToggle={handleFeatureToggle}
										getFeatureStep={getFeatureStep}
										buttonHandler={buttonHandler}
										onPageStructure={(data) => {
											setPageStructureData(data);
											setShowPageStructure(true);
										}}
										onDictionaryToggle={(key) => {
											const active = isActive(key);

											if (active) {
												// Already active - deactivate the feature
												handleFeatureToggle(key);
												setShowDictionary(false);
											} else {
												// Not active - activate and open modal
												handleFeatureToggle(key);
												setShowDictionary(true);
											}
										}}
										theme={containerTheme}
									/>
								</div>
							))
						) : (
							<div className="zn:!py-10 zn:text-center">
								<AnimatedToggleSwitch />
							</div>
						)}
					</div>
				)}
			</ScrollArea>
			{(() => {
				const statementLinkData =
					isStatementEnabledInWidget &&
					isStatementEnabledInWidget() &&
					getStatementLinkData
						? getStatementLinkData()
						: null;
				const showFooter = statementLinkData || !svgSettings.hideLogo;
				if (!showFooter) return null;
				return (
					<WidgetFooter
						svgSettings={svgSettings}
						statementLinkData={statementLinkData}
						isPopover={isPopover}
						theme={containerTheme}
						resetAll={resetAll}
					/>
				);
			})()}
		</>
	);

	return (
		<>
			<Toaster richColors position="top-left" />
			<div
				className={cn(
					"accessibility-widget-ready zn:fixed zn:z-[99999] zn:!font-sans",
					!svgSettings?.draggableEnabled &&
						(() => {
							const pos = isMobile
								? svgSettings?.buttonPositionMobile || "bottom-right"
								: svgSettings?.buttonPosition || "bottom-right";
							return {
								"zn:bottom-6 zn:end-6": pos === "bottom-right",
								"zn:bottom-6 zn:start-6": pos === "bottom-left",
								"zn:top-6 zn:end-6": pos === "top-right",
								"zn:top-6 zn:start-6": pos === "top-left",
								"zn:top-1/2 zn:-translate-y-1/2 zn:end-6":
									pos === "center-right",
								"zn:top-1/2 zn:-translate-y-1/2 zn:start-6":
									pos === "center-left",
								"zn:top-6 zn:-translate-x-1/2 zn:start-1/2":
									pos === "top-center",
								"zn:bottom-6 zn:-translate-x-1/2 zn:start-1/2":
									pos === "bottom-center",
							};
						})(),
				)}
				ref={svgSettings?.draggableEnabled ? widgetRef : null}
				id="accessibility-widget"
			>
				{isPopover ? (
					<Popover
						onOpenChange={(newOpen) => {
							if (newOpen) sounds.open();
							else sounds.close();
							setOpen(newOpen);
						}}
						open={open}
					>
						<PopoverTrigger
							className="zn:!bg-transparent zn:!p-0 zn:!rounded-0 zn:!border-0"
						>
							<WidgetTrigger svgSettings={svgSettings} />
						</PopoverTrigger>
						{(() => {
							// Determine popover side/align for center-left / center-right button positions
							const triggerPos = isMobile
								? svgSettings?.buttonPositionMobile || "bottom-right"
								: svgSettings?.buttonPosition || "bottom-right";
							const popoverSide =
								triggerPos === "center-right"
									? "left"
									: triggerPos === "center-left"
										? "right"
										: undefined;
							const popoverAlign =
								triggerPos === "center-right" || triggerPos === "center-left"
									? "center"
									: undefined;
							return (
								<PopoverContent
									style={{ height: "calc(100vh - 60px)" }}
									sideOffset={-70}
									{...(popoverSide ? { side: popoverSide } : {})}
									{...(popoverAlign ? { align: popoverAlign } : {})}
									className={cn(
										"zn:md:w-[540px] zn:w-full   zn:flex zn:flex-col zn:!pb-0  zn:!bg-primary-icon zn:font-sans",
										{
											"zn:md:w-[490px] zn:w-full":
												containerTheme === "default",
											"zn:min-w-[330px]": containerTheme === "classic",
										},
									)}
								>
									{PanelContent}
								</PopoverContent>
							);
						})()}
					</Popover>
				) : (
					<Sheet
						onOpenChange={(newOpen) => {
							if (newOpen) sounds.open();
							else sounds.close();
							setOpen(newOpen);
						}}
						open={open}
					>
						<SheetTrigger asChild>
							<span className="zn:!bg-transparent zn:!p-0 zn:!rounded-0 zn:!border-0">
								<WidgetTrigger svgSettings={svgSettings} />
							</span>
						</SheetTrigger>
						<SheetContent
							id="zn-sheet-widget"
							side={sheetSide}
							hideCloseButton
							hideOverlay={true}
							className={cn(
								"zn:w-full zn:!max-w-xl  zn:!bg-primary-icon zn:flex zn:flex-col zn:!pb-0",
								{
									"zn:!max-w-[490px]": containerTheme === "default",
								},
							)}
						>
							<SheetHeader className="zn:hidden">
								<SheetTitle></SheetTitle>
								<SheetDescription></SheetDescription>
							</SheetHeader>
							{PanelContent}
						</SheetContent>
					</Sheet>
				)}
				<DictionaryModal
					isOpen={showDictionary}
					onClose={() => setShowDictionary(false)}
					initialWord={dictionaryWord}
				/>
			</div>
		</>
	);
};

export default App;
