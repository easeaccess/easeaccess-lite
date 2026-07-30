/**
 * Admin Features-page menu — mirrors the EaseAccess Pro feature menu exactly
 * (same categories, order, labels and icons). Each item is flagged `premium`
 * so the Features page can render free features as toggles and Pro features as
 * informational PRO badges. This is DISPLAY ONLY — the front-end widget uses
 * DEFAULT_FEATURES (settings.js, free features only), so nothing here reaches
 * visitors and no Pro code ships.
 */
import {
	Scaling,
	Bold,
	Text,
	Baseline,
	Link2,
	ALargeSmall,
	BetweenHorizontalStart,
	Space,
	AlignLeft,
	BookA,
	Globe,
	DropletOff,
	Contrast,
	Droplet,
	LayoutPanelTop,
	MousePointer2,
	Highlighter,
	MousePointerClick,
	Image,
	AudioLines,
	Cast,
	Scan,
	CirclePause,
	ArrowUpToLine,
	ImageOff,
	Keyboard,
	Compass,
	Mic,
	SquareMousePointer,
	ZoomIn,
	MessageSquareMore,
} from "lucide-react";
import { isPremiumFeature } from "./premium-features";

const flag = (settings) =>
	settings.map((s) => ({ ...s, premium: isPremiumFeature(s.key) }));

export const FEATURE_MENU = [
	{
		title: "Content Adjustments",
		settings: flag([
			{ label: "Content Scaling", key: "contentScaling", icon: Scaling },
			{ label: "Readable Font", key: "readableFont", icon: Bold },
			{ label: "Dyslexia Friendly", key: "dyslexiaFriendly", icon: Text },
			{ label: "Highlight Titles", key: "highlightTitles", icon: Baseline },
			{ label: "Highlight Links", key: "highlightLinks", icon: Link2 },
			{ label: "Bigger Text", key: "adjustFontSizing", icon: ALargeSmall },
			{
				label: "Line Height",
				key: "adjustLineHeight",
				icon: BetweenHorizontalStart,
			},
			{ label: "Letter Spacing", key: "adjustLetterSpacing", icon: Space },
			{ label: "Text Alignment", key: "contentAlignment", icon: AlignLeft },
			{ label: "Dictionary", key: "dictionary", icon: BookA },
			{ label: "Translator", key: "quickTranslate", icon: Globe },
		]),
	},
	{
		title: "Color Adjustments",
		settings: flag([
			{ label: "Greyscale", key: "greyscale", icon: DropletOff },
			{ label: "Contrast", key: "contrast", icon: Contrast },
			{ label: "Color Saturation", key: "colorSaturation", icon: Droplet },
		]),
	},
	{
		title: "Navigation Adjustments",
		settings: flag([
			{ label: "Page Structure", key: "pageStructure", icon: LayoutPanelTop },
			{ label: "Big Cursor", key: "bigCursor", icon: MousePointer2 },
			{ label: "Pointer Trail", key: "pointerTrail", icon: Highlighter },
			{ label: "Click Spark", key: "clickSpark", icon: MousePointerClick },
			{ label: "Image Trails", key: "imageTrails", icon: Image },
		]),
	},
	{
		title: "Orientation Adjustments",
		settings: flag([
			{ label: "Page Reader", key: "pageReader", icon: AudioLines },
			{ label: "Screen reader", key: "screenReader", icon: Cast },
			{ label: "Reading mask", key: "readingMask", icon: Scan },
			{ label: "Pause animations", key: "pauseAnimations", icon: CirclePause },
			{ label: "Reading Guide", key: "readingGuide", icon: ArrowUpToLine },
			{ label: "Hide images", key: "hideImages", icon: ImageOff },
			{ label: "Keyboard Navigation", key: "outlineFocus", icon: Keyboard },
			{ label: "Landmark Hotkeys", key: "landmarkHotkeys", icon: Compass },
			{ label: "Voice Commands", key: "voiceCommands", icon: Mic },
			{ label: "Highlight Hover", key: "highlightHover", icon: SquareMousePointer },
			{ label: "Magnify Images", key: "magnifiImages", icon: ZoomIn },
			{ label: "Tooltips", key: "tooltips", icon: MessageSquareMore },
		]),
	},
];
