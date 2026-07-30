import { useState, useEffect } from "react";

import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";

import { Info, Edit } from "lucide-react";
import { useContext } from "@wordpress/element";
import AccessiblyContext from "../../context/accessibly-context";
import { LabelTooltip } from "@/components/label-tooltip";
import PreviewBox from "@/components/preview-box";
import { MotionTextLoader } from "@/components/motion-text-loader";
import AnimatedPreview from "../components/animated-preview";
import PopoverImage from "@/images/Popover.png";
import SidebarImage from "@/images/Sidebar.png";
import DefaultSidebarTheme from "@/images/sidebar-theme/default.svg";
import ClassicSidebarTheme from "@/images/sidebar-theme/classic.svg";
import { useLicense } from "@/context/license-context";
import { isPremiumFeature } from "@/constant/premium-features";

// __EASEACCESS_PRO__ is a build-time constant defined by webpack.DefinePlugin.
// In lite builds it is `false`, allowing Terser to dead-code-eliminate
// all `__EASEACCESS_PRO__ && <PRO badge JSX>` blocks.
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Crown } from "lucide-react";
import NavPreview from "../components/customization/nav-preview";
import { LANGUAGES } from "@/lib/languages";
export default function GeneralPage() {
	const { svgSettings, setSvgSettings, isLoading } =
		useContext(AccessiblyContext);
	const license = useLicense ? useLicense() : null;
	const hasFeature = (label) =>
		license?.hasFeature ? license.hasFeature(label) : true;

	const {
		enableWidget,
		soundEffectsEnabled = false,
		displayMode = "all",
		includePostTypes = [],
		excludePostTypes = [],
		displayContainerMode = "popover",
		containerTheme = "default",
		defaultLanguage = "en_US",
	} = svgSettings || {};

	// Auto-fallback to popover when license is deactivated and user had sheet selected
	useEffect(() => {
		if (
			displayContainerMode === "sheet" &&
			isPremiumFeature("sheetSidebar") &&
			!hasFeature("Sheet Sidebar")
		) {
			setSvgSettings((prev) => ({
				...prev,
				displayContainerMode: "popover",
			}));
		}
	}, [displayContainerMode, hasFeature, setSvgSettings]);

	const handlePostTypeChange = (type, checked, listKey) => {
		setSvgSettings((prev) => {
			const current = new Set(prev[listKey] || []);
			if (checked) current.add(type);
			else current.delete(type);
			return { ...prev, [listKey]: Array.from(current) };
		});
	};

	const POST_TYPES = ["post", "page", "product", "project"];

	// Normalize custom shortcut input
	const normalizeShortcut = (raw) => {
		if (!raw) return "Alt+Shift+A"; // default fallback
		return raw
			.split("+")
			.map((p) => p.trim())
			.filter(Boolean)
			.map((p) => {
				const l = p.toLowerCase();
				if (["ctrl", "control"].includes(l)) return "Ctrl";
				if (["alt"].includes(l)) return "Alt";
				if (["shift"].includes(l)) return "Shift";
				if (["meta", "cmd", "command"].includes(l)) return "Meta";
				return p.length === 1
					? p.toUpperCase()
					: p.charAt(0).toUpperCase() + p.slice(1);
			})
			.join("+");
	};

	if (isLoading) {
		return (
			<MotionTextLoader
				text="Loading Settings..."
				variant="dots"
				speed="fast"
			/>
		);
	}

	return (
		<div className="zn:grid zn:lg:grid-cols-2 zn:grid-cols-1 zn:gap-8">
			{/* General Settings */}
			<Card>
				<CardHeader className="zn:border-b zn:pb-6">
					<CardTitle>General Settings</CardTitle>
					<CardDescription>
						Optimize settings to enhance plugin performance.
					</CardDescription>
				</CardHeader>
				<CardContent className="zn:space-y-4 zn:divide-y zn:divide-gray-200">
					<div className="zn:flex zn:items-center zn:justify-between zn:pb-4">
						<LabelTooltip
							label="Activate the sidebar"
							tooltip="Hide or show the sidebar"
						/>
						<Switch
							id="sidebar-enabled"
							checked={enableWidget}
							onCheckedChange={() =>
								setSvgSettings((prev) => ({
									...prev,
									enableWidget: !prev.enableWidget,
								}))
							}
						/>
					</div>
					{enableWidget && (
						<div className="zn:space-y-3 zn:pb-4">
							<LabelTooltip
								tooltipClassName="zn:w-[180px]"
								label="Sidebar Type"
								tooltip="Choose between a Popover (floating panel) or Sheet (side drawer) layout."
							/>
							<RadioGroup
								value={displayContainerMode}
								onValueChange={(value) => {
									// Prevent selecting sheet if user doesn't have premium
									if (
										value === "sheet" &&
										isPremiumFeature("sheetSidebar") &&
										!hasFeature("Sheet Sidebar")
									) {
										return;
									}
									setSvgSettings((prev) => ({
										...prev,
										displayContainerMode: value,
									}));
								}}
								className="zn:grid  zn:md:grid-cols-2 zn:grid-cols-1 zn:gap-6"
							>
								{/* Popover Option */}
								<div className="zn:space-y-4">
									<RadioGroupItem
										value="popover"
										id="popover"
										className="zn:sr-only"
									/>
									<Label
										htmlFor="popover"
										className={cn(
											"zn:cursor-pointer zn:border zn:border-default-50 zn:transition-all zn:duration-150 zn:block zn:p-4 zn:bg-default-50 zn:rounded",
											{
												"zn:border-primary ":
													displayContainerMode === "popover",
											},
										)}
									>
										<div className="zn:flex zn:items-center zn:space-x-3 zn:mb-4">
											<div
												className={`zn:w-4 zn:h-4 zn:rounded-full zn:border-2 zn:flex zn:items-center zn:justify-center ${
													displayContainerMode === "popover"
														? "zn:border-primary zn:bg-primary"
														: "zn:border-gray-300"
												}`}
											>
												{displayContainerMode === "popover" && (
													<div className="zn:w-2 zn:h-2 zn:rounded-full zn:bg-white"></div>
												)}
											</div>
											<span className="zn:text-sm zn:font-medium">Popover</span>
										</div>

										<div>
											<img src={PopoverImage} alt="popover" />
										</div>
									</Label>
								</div>

								{/* Sheet Option (Pro) */}
								{isPremiumFeature("sheetSidebar") && (
									<div className="zn:space-y-4">
										<RadioGroupItem
											value="sheet"
											id="sheet"
											className="zn:sr-only"
										/>
										<Label
											htmlFor="sheet"
											className={cn(
												"zn:cursor-pointer zn:block zn:border zn:border-default-50 zn:transition-all zn:duration-150 zn:p-4 zn:bg-default-50 zn:rounded",
												{
													"zn:border-primary ":
														displayContainerMode === "sheet",
													"zn:opacity-50 zn:cursor-not-allowed":
														isPremiumFeature("sheetSidebar") &&
														!hasFeature("Sheet Sidebar"),
												},
											)}
										>
											<div className="zn:flex zn:items-center zn:space-x-3 zn:mb-4">
												<div
													className={`zn:w-4 zn:h-4 zn:rounded-full zn:border-2 zn:flex zn:items-center zn:justify-center ${
														displayContainerMode === "sheet"
															? "zn:border-primary zn:bg-primary"
															: "zn:border-gray-300"
													}`}
												>
													{displayContainerMode === "sheet" && (
														<div className="zn:w-2 zn:h-2 zn:rounded-full zn:bg-white"></div>
													)}
												</div>
												<span className="zn:text-sm zn:font-medium">
													Sidebar
												</span>
												{isPremiumFeature("sheetSidebar") &&
													!hasFeature("Sheet Sidebar") && (
														<HoverCard>
															<HoverCardTrigger>
																<div className="zn:cursor-pointer">
																	<Badge
																		variant="outline"
																		className="zn:text-xs zn:px-2 zn:py-0 zn:border-warning zn:text-warning zn:bg-warning-light"
																	>
																		PRO
																	</Badge>
																</div>
															</HoverCardTrigger>
															<HoverCardContent>
																<div className="zn:text-center">
																	<span className="zn:inline-flex zn:rounded-full zn:mb-6 zn:size-14 zn:items-center zn:justify-center zn:bg-warning-light">
																		<Crown className="zn:text-warning zn:size-6" />
																	</span>
																	<div className="zn:text-sm zn:font-bold zn:text-default-800 zn:mb-2">
																		Unlock Advanced Features
																	</div>
																	<div className="zn:text-xs zn:text-gray-500 zn:font-normal">
																		Upgrade now for advanced customization and
																		pro tools to boost your site.
																	</div>
																	<div className="zn:mt-2">
																		<Button
																			className="zn:w-full zn:cursor-pointer zn:bg-warning zn:hover:bg-warning/90"
																			onClick={() =>
																				window.open(
																					"https://easeaccess.io/pricing/",
																					"_blank",
																				)
																			}
																		>
																			Upgrade Now
																		</Button>
																	</div>
																</div>
															</HoverCardContent>
														</HoverCard>
													)}
											</div>

											<div>
												<img src={SidebarImage} alt="sidebar" />
											</div>
										</Label>
									</div>
								)}
							</RadioGroup>
						</div>
					)}

					{/* Container Theme Selection */}
					<div className=" zn:pb-4 zn:flex zn:flex-wrap zn:items-center zn:justify-between">
						<LabelTooltip
							label="Container Theme"
							tooltipClassName="zn:max-w-[200px]"
							tooltip="Choose between default modern styling or classic traditional styling for the widget container."
						/>
						<RadioGroup
							value={svgSettings?.containerTheme || "default"}
							onValueChange={(value) => {
								setSvgSettings((prev) => ({
									...prev,
									containerTheme: value,
								}));
							}}
							className="zn:flex zn:gap-6 zn:!mb-0"
						>
							{/* Default Theme Option */}
							<div className="zn:flex zn:items-center zn:space-x-2">
								<RadioGroupItem value="default" id="theme-default" />
								<Label
									htmlFor="theme-default"
									className="zn:cursor-pointer zn:text-sm zn:font-medium"
								>
									Default
								</Label>
							</div>

							{/* Classic Theme Option */}
							<div className="zn:flex zn:items-center zn:space-x-2">
								<RadioGroupItem value="classic" id="theme-classic" />
								<Label
									htmlFor="theme-classic"
									className="zn:cursor-pointer zn:text-sm zn:font-medium"
								>
									Classic
								</Label>
							</div>
						</RadioGroup>
					</div>

					{isPremiumFeature("accessibilityProfile") && (
						<div className="zn:flex zn:items-center zn:justify-between zn:pb-4">
							<div className="zn:flex zn:items-center zn:gap-2">
								<LabelTooltip
									tooltipClassName="zn:w-[180px]"
									label="Accessibility Profile Section"
									tooltip="Show or hide the preset accessibility profiles section on your site."
									className={cn({
										"zn:text-gray-400":
											isPremiumFeature("accessibilityProfile") &&
											!hasFeature("Accessibility Profile"),
									})}
								/>
								{isPremiumFeature("accessibilityProfile") &&
									!hasFeature("Accessibility Profile") && (
										<HoverCard>
											<HoverCardTrigger>
												<div className="zn:cursor-pointer">
													<Badge
														variant="outline"
														className="zn:text-xs zn:px-2 zn:py-0 zn:border-warning zn:text-warning zn:bg-warning-light"
													>
														PRO
													</Badge>
												</div>
											</HoverCardTrigger>
											<HoverCardContent>
												<div className="zn:text-center">
													<span className="zn:inline-flex zn:rounded-full zn:mb-6 zn:size-14 zn:items-center zn:justify-center zn:bg-warning-light">
														<Crown className="zn:text-warning zn:size-6" />
													</span>
													<div className="zn:text-sm zn:font-bold zn:text-default-800 zn:mb-2">
														Unlock Advanced Features
													</div>
													<div className="zn:text-xs zn:text-gray-500 zn:font-normal">
														Upgrade now for advanced customization and pro tools
														to boost your site.
													</div>
													<div className="zn:mt-2">
														<Button
															className="zn:w-full zn:cursor-pointer zn:bg-warning zn:hover:bg-warning/90"
															onClick={() =>
																window.open(
																	"https://easeaccess.io/pricing/",
																	"_blank",
																)
															}
														>
															Upgrade Now
														</Button>
													</div>
												</div>
											</HoverCardContent>
										</HoverCard>
									)}
							</div>
							<Switch
								id="show-accessibility-profile"
								checked={!!svgSettings.showAccessibilityProfile}
								disabled={
									isPremiumFeature("accessibilityProfile") &&
									!hasFeature("Accessibility Profile")
								}
								onCheckedChange={(checked) =>
									setSvgSettings((prev) => ({
										...prev,
										showAccessibilityProfile: checked,
									}))
								}
							/>
						</div>
					)}

					<div className="zn:flex zn:items-center zn:justify-between zn:pb-4">
						<div className="zn:flex zn:items-center zn:gap-2 zn:flex-1">
							<LabelTooltip
								label="Enable sound effects"
								tooltip="Turn sound effects on or off."
							/>
						</div>
						<Switch
							id="sound-effects"
							checked={soundEffectsEnabled}
							onCheckedChange={(checked) =>
								setSvgSettings((prev) => ({
									...prev,
									soundEffectsEnabled: checked,
								}))
							}
						/>
					</div>

					<div className="zn:flex zn:items-center zn:justify-between zn:gap-4 zn:pb-4">
						<LabelTooltip
							label="Interface language"
							tooltipClassName="zn:w-[220px]"
							tooltip="Visitors see the site in this language until they choose their own language from the frontend widget."
						/>
						<Select
							value={defaultLanguage}
							onValueChange={(value) =>
								setSvgSettings((prev) => ({
									...prev,
									defaultLanguage: value,
								}))
							}
						>
							<SelectTrigger
								id="default-frontend-language"
								className="zn:w-[220px]"
							>
								<SelectValue placeholder="Select language" />
							</SelectTrigger>
							<SelectContent className="zn:!h-[230px]">
								{LANGUAGES.map((language) => (
									<SelectItem key={language.code} value={language.code}>
										{language.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Display Conditions */}
					<div className="zn:space-y-4 zn:pb-4">
						<div className="zn:flex zn:items-center zn:justify-between">
							<LabelTooltip
								tooltipClassName="zn:w-[180px]"
								label="Display Conditioner:"
								tooltip="Choose the best location for the accessibility widget."
							/>
							<Select
								value={displayMode}
								onValueChange={(val) =>
									setSvgSettings((prev) => ({ ...prev, displayMode: val }))
								}
							>
								<SelectTrigger className="zn:w-[200px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Show on All Pages</SelectItem>
									<SelectItem value="include">
										Show on Specific Pages
									</SelectItem>
									<SelectItem value="exclude">
										Hide on Specific Pages
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{displayMode !== "all" && (
							<div className="zn:space-y-2">
								{/* <div className="zn:text-xs zn:text-muted-foreground">
									{displayMode === "include"
										? "Widget will only appear on selected post types."
										: "Widget will appear everywhere except selected post types."}
								</div> */}
								<div className="zn:flex zn:flex-wrap zn:gap-4">
									{POST_TYPES.map((type) => {
										const listKey =
											displayMode === "include"
												? "includePostTypes"
												: "excludePostTypes";
										const list =
											displayMode === "include"
												? includePostTypes
												: excludePostTypes;
										return (
											<div
												key={type}
												className="zn:flex zn:items-center zn:space-x-2"
											>
												<Checkbox
													id={`disp-${type}`}
													checked={list.includes(type)}
													onCheckedChange={(checked) =>
														handlePostTypeChange(type, !!checked, listKey)
													}
												/>
												<Label htmlFor={`disp-${type}`}>
													{type.charAt(0).toUpperCase() + type.slice(1)}
												</Label>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>

					{isPremiumFeature("openKeyboardShortcuts") && (
						<div className="zn:flex zn:items-center zn:justify-between zn:pb-4">
							<div className="zn:flex zn:items-center zn:gap-2">
								<LabelTooltip
									tooltipClassName="zn:w-[180px]"
									label={
										<>
											Use the keyboard shortcut (
											{svgSettings.keyboardShortcut || "Alt+Shift+A"})
										</>
									}
									tooltip="Enable or disable the keyboard shortcut for the accessibility widget."
									className={cn({
										"zn:text-gray-400":
											isPremiumFeature("openKeyboardShortcuts") &&
											!hasFeature("Custom Keyboard Shortcuts"),
									})}
								/>
								{isPremiumFeature("openKeyboardShortcuts") &&
									!hasFeature("Custom Keyboard Shortcuts") && (
										<HoverCard>
											<HoverCardTrigger>
												<div className="zn:cursor-pointer">
													<Badge
														variant="outline"
														className="zn:text-xs zn:px-2 zn:py-0 zn:border-warning zn:text-warning zn:bg-warning-light"
													>
														PRO
													</Badge>
												</div>
											</HoverCardTrigger>
											<HoverCardContent>
												<div className="zn:text-center">
													<span className="zn:inline-flex zn:rounded-full zn:mb-6 zn:size-14 zn:items-center zn:justify-center zn:bg-warning-light">
														<Crown className="zn:text-warning zn:size-6" />
													</span>
													<div className="zn:text-sm zn:font-bold zn:text-default-800 zn:mb-2">
														Unlock Advanced Features
													</div>
													<div className="zn:text-xs zn:text-gray-500 zn:font-normal">
														Upgrade now for advanced customization and pro tools
														to boost your site.
													</div>
													<div className="zn:mt-2">
														<Button
															className="zn:w-full zn:cursor-pointer zn:bg-warning zn:hover:bg-warning/90"
															onClick={() =>
																window.open(
																	"https://easeaccess.io/pricing/",
																	"_blank",
																)
															}
														>
															Upgrade Now
														</Button>
													</div>
												</div>
											</HoverCardContent>
										</HoverCard>
									)}
							</div>
							<Switch
								id="open-keyboard-shortcuts"
								checked={!!svgSettings.openKeyboardShortcuts}
								disabled={
									isPremiumFeature("openKeyboardShortcuts") &&
									!hasFeature("Custom Keyboard Shortcuts")
								}
								onCheckedChange={(checked) =>
									setSvgSettings((prev) => ({
										...prev,
										openKeyboardShortcuts: checked,
									}))
								}
							/>
						</div>
					)}

					{__EASEACCESS_PRO__ && svgSettings.openKeyboardShortcuts && (
						<div className="zn:mt-3 zn:gap-1 zn:pb-4 zn:flex zn:items-center zn:justify-between">
							<Label className="zn:flex-1">Custom Shortcut</Label>
							<div className="zn:flex-none">
								<Input
									id="keyboard-shortcut-input"
									value={svgSettings.keyboardShortcut || ""}
									placeholder="e.g. Ctrl+Alt+K"
									className="zn:max-w-[350px]"
									disabled={
										isPremiumFeature("openKeyboardShortcuts") &&
										!hasFeature("Custom Keyboard Shortcuts")
									}
									onChange={(e) =>
										setSvgSettings((prev) => ({
											...prev,
											keyboardShortcut: e.target.value,
										}))
									}
									onBlur={(e) =>
										setSvgSettings((prev) => ({
											...prev,
											keyboardShortcut: normalizeShortcut(e.target.value),
										}))
									}
								/>
							</div>
						</div>
					)}

					{/* Device Visibility */}
					<div className="zn:mt-6 zn:space-y-2 zn:pb-4">
						<div className="zn:flex zn:items-center zn:justify-between">
							<Label>Hide widget on specific devices </Label>
							<div className="zn:flex zn:gap-6 zn:flex-wrap">
								{["desktop", "tablet", "mobile"].map((dev) => (
									<label
										key={dev}
										className="zn:flex zn:items-center zn:gap-2 zn:text-sm zn:cursor-pointer"
									>
										<Checkbox
											checked={!!svgSettings?.hideOnDevices?.[dev]}
											onCheckedChange={(checked) =>
												setSvgSettings((prev) => ({
													...prev,
													hideOnDevices: {
														...prev.hideOnDevices,
														[dev]: !!checked,
													},
												}))
											}
										/>
										<span className="zn:capitalize">{dev}</span>
									</label>
								))}
							</div>
						</div>
					</div>

					{__EASEACCESS_PRO__ && (
						<div className="zn:flex zn:items-center zn:justify-between">
							<div className="zn:flex zn:items-center zn:gap-2">
								<LabelTooltip
									tooltipClassName="zn:w-[180px]"
									label="Hide logo and branding on the EaseAccess interface."
									tooltip="Hide or show the 'Powered by EaseAccess' logo in the widget menu."
									className={cn({
										"zn:text-gray-400":
											isPremiumFeature("hideLogo") &&
											!hasFeature("Hide Logo and Branding"),
									})}
								/>
								{isPremiumFeature("hideLogo") &&
									!hasFeature("Hide Logo and Branding") && (
										<HoverCard>
											<HoverCardTrigger>
												<div className="zn:cursor-pointer">
													<Badge
														variant="outline"
														className="zn:text-xs zn:px-2 zn:py-0 zn:border-warning zn:text-warning zn:bg-warning-light"
													>
														PRO
													</Badge>
												</div>
											</HoverCardTrigger>
											<HoverCardContent>
												<div className="zn:text-center">
													<span className="zn:inline-flex zn:rounded-full zn:mb-6 zn:size-14 zn:items-center zn:justify-center zn:bg-warning-light">
														<Crown className="zn:text-warning zn:size-6" />
													</span>
													<div className="zn:text-sm zn:font-bold zn:text-default-800 zn:mb-2">
														Unlock Advanced Features
													</div>
													<div className="zn:text-xs zn:text-gray-500 zn:font-normal">
														Upgrade now for advanced customization and pro tools
														to boost your site.
													</div>
													<div className="zn:mt-2">
														<Button
															className="zn:w-full zn:cursor-pointer zn:bg-warning zn:hover:bg-warning/90"
															onClick={() =>
																window.open(
																	"https://easeaccess.io/pricing/",
																	"_blank",
																)
															}
														>
															Upgrade Now
														</Button>
													</div>
												</div>
											</HoverCardContent>
										</HoverCard>
									)}
							</div>
							<Switch
								id="hide-logo"
								checked={!!svgSettings.hideLogo}
								disabled={
									isPremiumFeature("hideLogo") &&
									!hasFeature("Hide Logo and Branding")
								}
								onCheckedChange={(checked) =>
									setSvgSettings((prev) => ({ ...prev, hideLogo: checked }))
								}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Module Preview */}
			<Card className="zn:md:flex zn:hidden zn:h-max zn:sticky zn:top-14">
				<CardHeader>
					<CardTitle>Preview</CardTitle>
					<CardDescription>
						The widget will look like this to your visitors.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{svgSettings?.navMode === true ? (
						<NavPreview />
					) : (
						<AnimatedPreview
							enableWidget={enableWidget}
							displayContainerMode={displayContainerMode}
							containerTheme={containerTheme}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
