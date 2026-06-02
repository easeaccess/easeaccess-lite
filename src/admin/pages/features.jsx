"use client";

import { useState, useEffect, useContext, Fragment } from "@wordpress/element";
import {
	Eye,
	Layout,
	BookOpen,
	Link,
	RotateCcw,
	X,
	Crown,
	Package,
	ChevronDown,
} from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import AccessiblyContext from "../../context/accessibly-context";
import { useLicense } from "../../context/license-context";
import { PREMIUM_FEATURES } from "../../hooks/use-license";
import { isPremiumFeature } from "@/constant/premium-features";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatedItem } from "@/motions/animated-item";
import ClickSparkAdminSettings from "@/admin/components/click-spark-admin-settings";
import MouseTrailsAdminSettings from "@/admin/components/mouse-trails-admin-settings";
import AnimatedToggleSwitch from "@/components/animated-switch";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MotionTextLoader } from "@/components/motion-text-loader";
import { AppTooltip } from "@/components/tolltip-provider";
import { accessibilityProfile } from "@/lib/accessibility-profiles-data";
import { LabelTooltip } from "@/components/label-tooltip";
import FlagIcon from "@/components/FlagIcon";
import HeaderShape from "@/frontend/widget/components/header-shape";
import FrontEndLogo from "@/frontend/widget/components/front-end-logo";
import { ForwardMedia } from "@/icons";
export default function Featurepage() {
	const { features, setFeatures, isSaving, isLoading, svgSettings } =
		useContext(AccessiblyContext);

	const { hasFeature, isValid } = useLicense();

	const theme = svgSettings?.containerTheme;

	const enabledFeatures = features
		.flatMap((category) => category.settings)
		.filter((f) => f.enabled);

	const handleResetAll = () => {
		const updated = features.map((category) => ({
			...category,
			settings: category.settings.map((setting) => ({
				...setting,
				enabled: false,
			})),
		}));
		setFeatures(updated);
		toast.success("All features have been reset");
	};

	if (isLoading) {
		return (
			<MotionTextLoader
				text="Loading Features..."
				variant="dots"
				speed="fast"
			/>
		);
	}

	return (
		<div>
			{/* Main Content */}
			<div className="zn:grid zn:grid-cols-12 zn:gap-6 zn:relative">
				<Card className="zn:lg:col-span-7 zn:col-span-12">
					<CardHeader>
						<CardTitle>Feature Menu</CardTitle>
						<CardDescription>
							Choose which accessibility features and capabilities you want to
							include.
						</CardDescription>
					</CardHeader>
					<CardContent className="zn:space-y-6">
						{features.map((category, featureIndex) => (
							<AnimatedItem key={category.title} delay={featureIndex * 0.15}>
								<div className="zn:text-sm zn:font-semibold zn:mb-2">
									{category.title}
								</div>
								<div className="">
									{category.settings.map((setting) => {
										// Check if feature requires license
										const premium = isPremiumFeature(setting.key);
										const isLocked = premium && !hasFeature(setting.label);

										return (
											<div
												key={setting.key}
												className="zn:py-4 zn:border-b zn:border-gray-200 last:zn:border-b-0 zn:last:border-b-0 zn:last:pb-0"
											>
												<div className="zn:flex zn:items-center zn:justify-between">
													<div className="zn:flex zn:items-center zn:gap-2">
														<setting.icon
															className={`zn:w-5 zn:h-5 ${
																isLocked
																	? "zn:text-gray-400"
																	: "zn:text-gray-900"
															}`}
														/>
														<span
															className={cn("zn:text-sm zn:text-gray-900", {
																"zn:text-gray-500": isLocked,
															})}
														>
															{setting.label}
														</span>
														{__EASEACCESS_PRO__ && isLocked && (
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
													<Switch
														checked={setting.enabled && !isLocked}
														disabled={__EASEACCESS_PRO__ && isLocked}
														onCheckedChange={() => {
															if (__EASEACCESS_PRO__ && isLocked) {
																toast.error(
																	"This is a premium feature. Please activate your license to use it.",
																);
																return;
															}
															const updated = features.map((cat) => ({
																...cat,
																settings: cat.settings.map((s) =>
																	s.key === setting.key
																		? { ...s, enabled: !s.enabled }
																		: s,
																),
															}));
															setFeatures(updated);
														}}
													/>
												</div>
												{setting.key === "clickSpark" &&
													setting.enabled &&
													!isLocked && <ClickSparkAdminSettings />}
												{setting.key === "imageTrails" &&
													setting.enabled &&
													!isLocked && <MouseTrailsAdminSettings />}
											</div>
										);
									})}
								</div>
							</AnimatedItem>
						))}
					</CardContent>
				</Card>

				{/* Preview Panel */}
				<div className="zn:lg:col-span-5 zn:col-span-12 zn:lg:block zn:hidden ">
					<Card className="zn:sticky zn:top-16 ">
						<CardHeader>
							<CardTitle>Preview</CardTitle>
							<CardDescription className="zn:text-sm zn:text-gray-600">
								This is what the widget will look like to your site viewers.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{/* Widget Preview */}
							<div
								className={cn("", {
									"zn:bg-primary-icon zn:rounded-t-md zn:relative   zn:text-primary-icon-foreground":
										theme === "classic",
									"zn:bg-primary-icon zn:p-4": theme === "default",
								})}
							>
								{theme === "classic" && (
									<Fragment>
										<div className="zn:flex zn:items-center zn:justify-between zn:mb-4 zn:px-4 zn:pt-4">
											<div className="flex-1">
												<div
													className={cn(
														"zn:flex zn:items-center zn:gap-2 zn:hover:!bg-black/20 zn:bg-transparent zn:text-sm zn:cursor-pointer zn:outline-none zn:select-none zn:!px-4 zn:!py-2 zn:rounded-full",
													)}
												>
													<FlagIcon
														countryCode="en"
														className="zn:w-5 zn:h-4"
													/>
													<span>En</span>
													<ChevronDown className="zn:size-4 zn:transition-transform" />
												</div>
											</div>
											<div className="zn:flex zn:gap-3 ">
												<AppTooltip
													title={
														<>
															<Button
																variant="ghost"
																size="icon"
																className="zn:text-white"
															>
																<RotateCcw className="zn:w-4 zn:h-4" />
															</Button>
														</>
													}
													content="Reset all features"
												/>

												<AppTooltip
													title={
														<Button
															variant="ghost"
															size="icon"
															className="zn:text-white"
														>
															<X className="zn:w-4 zn:h-4" />
														</Button>
													}
													content="Close Widget"
												/>
											</div>
										</div>
										<div className="zn:text-center zn:pt-4 zn:pb-7 zn:px-4">
											<div className="zn:text-primary-icon-foreground zn:text-xl zn:font-semibold zn:mb-2  zn:leading-none">
												Accessibility Adjustments
											</div>
											<div className=" zn:text-xs zn:leading-tight">
												Write a short description, that will describe the title
												<span className=" zn:font-semibold  zn:leading-tight">
													(CTRL+U)
												</span>
											</div>
										</div>
									</Fragment>
								)}
								{theme === "default" && (
									<div className="zn:!bg-[#F2F4F8] zn:!px-4 zn:flex zn:items-center zn:justify-between zn:min-h-[68px] zn:relative">
										<div>
											<span className="zn:cursor-pointer zn:inline-flex zn:items-center zn:gap-2 zn:px-2 zn:py-1 zn:!bg-transparent zn:hover:!bg-black/10 zn:transition-all zn:duration-150 zn:rounded-md zn:text-default-800 zn:w-max">
												<FlagIcon countryCode="en" className="zn:size-4" />
												<span className="zn:text-sm zn:font-medium">En</span>
											</span>
										</div>
										<div className="zn:relative zn:-top-4 zn:z-0 zn:max-w-[330px]">
											<HeaderShape width={300} />
											<div className="zn:absolute zn:top-0 zn:w-full zn:h-full zn:flex zn:flex-col zn:items-center zn:justify-center">
												<FrontEndLogo />
												<span className="zn:text-base zn:font-semibold zn:!mt-2 zn:capitalize zn:!text-primary-icon-foreground">
													Accessibility
												</span>
											</div>
										</div>
										<div className="  zn:grid zn:grid-cols-2 zn:!gap-1 zn:!-ml-5 zn:relative zn:z-10 ">
											<AppTooltip
												title={
													<span className="zn:cursor-pointer zn:inline-flex zn:items-center zn:justify-center zn:size-9 zn:!bg-transparent zn:hover:!bg-black/10 zn:transition-all zn:duration-150 zn:rounded-full zn:text-default-800">
														<ForwardMedia className="zn:size-5" />
													</span>
												}
												content="Reset All"
											/>
											<AppTooltip
												title={
													<span className="zn:cursor-pointer zn:inline-flex zn:items-center zn:justify-center zn:size-9 zn:!bg-transparent zn:hover:!bg-black/10 zn:transition-all zn:duration-150 zn:rounded-full zn:text-default-800">
														<X className="zn:size-5" />
													</span>
												}
												content="Close"
											/>
										</div>
									</div>
								)}
								<ScrollArea className="zn:h-[300px] ">
									{enabledFeatures.length === 0 ? (
										<div
											className={cn(
												"zn:flex zn:flex-col zn:items-center zn:justify-center zn:h-[300px] zn:bg-[#EFF4FF]",
												{
													"zn:rounded-t-lg": theme === "classic",
												},
											)}
										>
											<AnimatedToggleSwitch />
										</div>
									) : (
										<div
											className={cn("zn:bg-[#EFF4FF] zn:px-4 zn:py-6 ", {
												"zn:rounded-t-lg ": theme === "classic",
											})}
										>
											{__EASEACCESS_PRO__ && isValid && (
												<div>
													<LabelTooltip
														label="Choose an accessibility profile"
														tooltipClassName="zn:max-w-[200px]"
														tooltip="
																	Select a profile that best fits your accessibility needs. Each profile enables a set of features designed to enhance user experience.
																"
													/>
												</div>
											)}
											{__EASEACCESS_PRO__ && isValid && (
												<div className="zn:grid zn:grid-cols-1 zn:md:grid-cols-2 zn:gap-4 zn:!mt-3 ">
													{accessibilityProfile?.map((item, index) => {
														const IconComponent = item.icon;

														return (
															<div
																key={item.id}
																className={cn(
																	"zn:!bg-white zn:cursor-pointer zn:!py-3.5 zn:!px-3 zn:rounded-md  zn:border zn:transition zn:relative zn:border-default-200 ",
																)}
															>
																<div className="zn:flex zn:items-center zn:gap-3 zn:relative zn:text-default-800">
																	<div className="zn:flex-shrink-0">
																		<IconComponent
																			className={cn("zn:w-6 zn:h-6", {})}
																		/>
																	</div>
																	<span
																		className={cn(
																			"zn:font-medium zn:!text-sm",
																			{},
																		)}
																	>
																		{item.title}
																	</span>
																</div>
															</div>
														);
													})}
												</div>
											)}
											{/* Dynamic Feature Groups */}
											{features.map((category) => {
												// Get enabled features for this category
												const categoryEnabledFeatures =
													category.settings.filter((setting) => {
														const premium = isPremiumFeature(setting.key);
														const isLocked =
															premium && !hasFeature(setting.label);
														return setting.enabled && !isLocked;
													});

												// Skip categories with no enabled features
												if (categoryEnabledFeatures.length === 0) return null;

												return (
													<div key={category.title} className="zn:mb-6">
														<div className="zn:my-4">
															<LabelTooltip
																label={category.title}
																tooltipClassName="zn:max-w-[200px]"
																tooltip={
																	category.infoTooltip ||
																	`Adjust ${category.title.toLowerCase()} to better suit your accessibility needs.`
																}
															/>
														</div>
														<div
															className={cn("zn:grid zn:gap-4", {
																"zn:grid-cols-2": theme !== "classic",
																"zn:grid-cols-3": theme === "classic",
															})}
														>
															{categoryEnabledFeatures.map((feature) => (
																<div
																	key={feature.key}
																	className={cn(
																		"zn:flex zn:text-gray-800 zn:flex-col zn:items-center zn:gap-2 zn:p-2 hover:zn:bg-blue-700 zn:cursor-pointer zn:border shadow-[0px_0px_0px_4px_rgba(209,224,255,1.00)] zn:bg-white zn:rounded-lg",
																		{
																			"zn:flex-row": theme === "default",
																		},
																	)}
																>
																	<div className="zn:w-7 zn:h-7 zn:flex zn:items-center zn:justify-center">
																		{React.createElement(feature.icon, {
																			className: "zn:w-5 zn:h-5",
																		})}
																	</div>
																	<span className="zn:text-sm zn:text-center zn:text-gray-800 zn:leading-tight">
																		{feature.label
																			.split(" ")
																			.map(
																				(word) =>
																					word.charAt(0).toUpperCase() +
																					word.slice(1),
																			)
																			.join(" ")}
																	</span>
																</div>
															))}
														</div>
													</div>
												);
											})}
										</div>
									)}
								</ScrollArea>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
