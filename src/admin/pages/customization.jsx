"use client";

import { useContext, useState } from "@wordpress/element";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CheckFill } from "../../icons";
import { Upload, X } from "lucide-react";
import AccessiblyContext from "../../context/accessibly-context";
import { cn, getContrastTextColor } from "../../lib/utils";
import RenderIcon from "@/components/render-icon";
import ButtonPreview from "../components/customization/button-preview";
import ColorPicker from "../../components/color-picker";
import {
	predefinedIcons,
	sizes,
	radius,
	sizeLabels,
	radiusLabels,
} from "../../constant/data";
import SizeSkelation from "../../components/size-skelation";
import IconBoxSkelation from "../../components/icon-box-skelation";
import ButtonLocationSettings from "../components/customization/button-location";
import { Switch } from "@/components/ui/switch";
import { LabelTooltip } from "@/components/label-tooltip";
import NavPreview from "../components/customization/nav-preview";

export default function Customization() {
	const { svgSettings, setSvgSettings, isLoading } =
		useContext(AccessiblyContext);
	const [previewDevice, setPreviewDevice] = useState("desktop");

	const openMediaLibrary = (onSelect) => {
		const fileFrame = wp.media({
			title: "Select or Upload SVG",
			button: { text: "Use this SVG" },
			library: { type: "image" },
			multiple: false,
		});

		fileFrame.on("select", () => {
			const attachment = fileFrame.state().get("selection").first().toJSON();
			if (attachment.mime !== "image/svg+xml") {
				alert("Please select an SVG file.");
				return;
			}
			onSelect(attachment.url);
		});

		fileFrame.open();
	};

	const handleMediaUpload = () => {
		openMediaLibrary((url) => {
			fetch(url)
				.then((res) => res.text())
				.then((svgContent) => {
					setSvgSettings({
						...svgSettings,
						customSvg: svgContent,
						processedSvg: null,
						selectedIcon: null,
						labelButtonActive: false,
					});
					localStorage.setItem("customSvgUrl", url);
				});
		});
	};

	return (
		<div className="zn:grid zn:grid-cols-12 zn:gap-6 zn:relative ">
			<Card className="zn:lg:col-span-8 zn:col-span-12">
				<CardHeader className="zn:border-b zn:pb-6">
					<CardTitle>Button Customization</CardTitle>
					<CardDescription>
						Personalize the look and feel of the accessibility button.
					</CardDescription>
				</CardHeader>
				<CardContent className="zn:space-y-6">
					{/* Icon List */}
					<div>
						<LabelTooltip
							label="Select a button style"
							labelClassName="zn:text-[13px]"
							tooltip={`Choose a predefined icon or upload your own SVG.`}
							className="zn:mb-2"
						/>
						<div className="zn:grid zn:lg:grid-cols-4 zn:md:grid-cols-3 zn:grid-cols-2  zn:gap-3">
							{predefinedIcons.map((iconItem) => {
								const IconComponent = iconItem.icon;
								const isSelected =
									svgSettings.selectedIcon === iconItem.name &&
									!svgSettings.customSvg;
								if (isLoading) {
									return <IconBoxSkelation key={iconItem.name} />;
								}
								return (
									<div
										key={iconItem.name}
										size="sm"
										className={cn(
											"zn:w-full zn:cursor-pointer zn:relative zn:rounded zn:border zn:border-default-100 zn:p-2 zn:flex zn:items-center zn:justify-center zn:px-13 zn:py-5",
											{
												"zn:bg-primary-50 zn:border-primary": isSelected,
												"zn:bg-default-50": !isSelected,
											},
										)}
										onClick={() => {
											setSvgSettings({
												...svgSettings,
												customSvg: null,
												processedSvg: null,
												selectedIcon: iconItem.name,
												labelButtonActive: false,
											});
										}}
										title={iconItem.name}
									>
										<div
											className={cn(
												"zn:absolute zn:end-1 zn:top-1 zn:opacity-0 zn:invisible zn:scale-50 zn:duration-200 zn:text-primary",
												{
													"zn:opacity-100 zn:visible zn:scale-100": isSelected,
												},
											)}
										>
											<CheckFill />
										</div>

										<span className=" zn:size-10 zn:flex zn:items-center zn:justify-center zn:bg-primary zn:text-primary-foreground zn:rounded-full  ">
											<IconComponent
												size={20}
												className={cn(
													"zn:ring-[1.5px] zn:ring-primary-foreground zn:ring-offset-[3px] zn:ring-offset-primary  zn:rounded-full",
												)}
											/>
										</span>
									</div>
								);
							})}
							{/* Custom Icon */}
							{svgSettings.customSvg && (
								<div
									key="custom-svg"
									className={cn(
										"zn:w-full zn:relative zn:rounded zn:border zn:border-primary zn:bg-primary-50 zn:p-2 zn:flex zn:items-center zn:justify-center zn:px-3 zn:py-5 zn:cursor-pointer",
									)}
									title="Custom Icon"
								>
									<span
										aria-label="Remove custom icon"
										onClick={(e) => {
											e.stopPropagation();
											setSvgSettings({
												...svgSettings,
												customSvg: null,
												processedSvg: null,
												selectedIcon: null,
												labelButtonActive: false,
											});
											localStorage.removeItem("customSvgUrl");
										}}
										className="zn:absolute zn:top-1 zn:end-1 zn:inline-flex zn:items-center zn:justify-center zn:rounded zn:bg-white/80 hover:zn:bg-white zn:text-gray-700 zn:border zn:border-gray-300 zn:size-5"
									>
										<X className="zn:size-3" />
									</span>
									<span className="zn:size-10 zn:flex zn:items-center zn:justify-center zn:bg-primary zn:text-primary-foreground zn:rounded-full">
										<RenderIcon
											svgSettings={svgSettings}
											className="zn:!size-5"
										/>
									</span>
								</div>
							)}

							{(() => {
								const isSelectedLabel = svgSettings.labelButtonActive;
								return (
									<div
										className={cn(
											"zn:w-full zn:cursor-pointer zn:relative zn:rounded zn:border zn:p-2 zn:flex zn:items-center zn:justify-center zn:px-3 zn:py-5",
											{
												"zn:border-primary zn:bg-primary-50": isSelectedLabel,
												"zn:border-default-100 zn:bg-default-50":
													!isSelectedLabel,
											},
										)}
										onClick={() =>
											setSvgSettings((prev) => ({
												...prev,
												labelButtonActive: true,
												selectedIcon: null,
												customSvg: null,
												processedSvg: null,
											}))
										}
										title="Button Text Type"
									>
										<div
											className={cn(
												"zn:absolute zn:end-1 zn:top-1 zn:opacity-0 zn:invisible zn:scale-50 zn:duration-200",
												{
													"zn:opacity-100 zn:visible zn:scale-100":
														isSelectedLabel,
												},
											)}
										>
											<CheckFill className="zn:text-primary" />
										</div>
										<span className="zn:block zn:w-full zn:flex-1 zn:bg-primary zn:text-primary-foreground zn:rounded zn:px-4 zn:py-3 zn:text-sm zn:font-medium hover:zn:bg-primary/90 focus:zn:outline-none focus:zn:ring-2 focus:zn:ring-primary focus:zn:ring-offset-2">
											{svgSettings.buttonLabel || "Accessibility"}
										</span>
									</div>
								);
							})()}
							<div
								className={cn(
									"zn:w-full zn:cursor-pointer zn:relative zn:rounded zn:border zn:border-default-100 zn:p-2 zn:flex zn:items-center zn:bg-default-50 zn:justify-center zn:px-3 zn:py-5",
									{},
								)}
							>
								<div
									className={cn(
										"zn:absolute zn:end-1 zn:text-center zn:top-1 zn:opacity-0 zn:invisible zn:scale-50 zn:duration-200 ",
										{ "zn:opacity-100 zn:visible zn:scale-100": false },
									)}
								>
									<CheckFill />
								</div>

								<span
									onClick={handleMediaUpload}
									className=" zn:text-primary zn:block zn:w-full zn:text-center"
								>
									<Upload size={16} className="zn:mx-auto" />
									<span className="zn:block">
										{svgSettings.customSvg
											? "Replace custom icon"
											: "Add custom icon"}
									</span>
								</span>
							</div>
						</div>

						{/* Only show Edit Button Text section when text button is selected */}
						{svgSettings.labelButtonActive &&
							!svgSettings.selectedIcon &&
							!svgSettings.customSvg && (
								<div className="zn:mt-6 zn:space-y-3">
									<div className="zn:flex zn:items-center zn:justify-between zn:gap-2">
										<LabelTooltip
											label="Edit Button Text"
											labelClassName="zn:text-[13px]"
											tooltip="Customize the text displayed on the accessibility button."
										/>
									</div>
									<div className="zn:space-y-2">
										<Input
											className="zn:!bg-default-50 zn:!border-default-100"
											type="text"
											value={svgSettings.buttonLabel || ""}
											placeholder="Accessibility"
											onChange={(e) =>
												setSvgSettings((prev) => ({
													...prev,
													buttonLabel: e.target.value,
												}))
											}
										/>
									</div>
								</div>
							)}
					</div>

					{/* Icon Settings */}
					<div className="">
						<LabelTooltip
							label="Select a button size"
							labelClassName="zn:text-[13px]"
							className="zn:mb-2"
							tooltip="Choose a size for the button."
						/>
						<div className="zn:flex zn:flex-wrap zn:gap-4 zn:max-w-[700px] ">
							{sizes.map((size, index) => {
								if (isLoading) {
									return <SizeSkelation key={size} />;
								}
								return (
									<div
										onClick={() =>
											setSvgSettings((prev) => ({ ...prev, size: size }))
										}
										key={size}
										className={cn(
											"zn:inline-flex zn:flex-1 zn:text-xs zn:items-center  zn:font-medium zn:gap-2 zn:p-2 zn:rounded zn:border zn:cursor-pointer zn:border-default-100 zn:bg-default-50",
											{
												"zn:bg-primary-50 zn:border-primary":
													svgSettings.size === size,
											},
										)}
									>
										<div
											className={cn(
												"zn:h-4  zn:w-4 zn:border-[1.5px] zn:border-default-700  zn:rounded-full zn:transition-all zn:duration-150 zn:ring-2 zn:ring-inset zn:ring-offset-0  ",
												{
													"zn:ring-primary zn:bg-primary zn:ring-offset-4 zn:border-primary":
														svgSettings.size === size,
													"zn:bg-white zn:ring-white":
														svgSettings.size !== size,
												},
											)}
										></div>
										<span className=" zn:leading-none">{sizeLabels[size]}</span>
									</div>
								);
							})}
						</div>
					</div>
					{/* buton radius */}
					<div className="zn:grid md:zn:grid-cols-2 ">
						<LabelTooltip
							label="Button Radius"
							labelClassName="zn:text-[13px]"
							className="zn:mb-2"
							tooltip="Choose a radius for the button."
						/>
						<div className="zn:flex zn:flex-wrap zn:gap-4 zn:max-w-[700px] ">
							{radius.map((size, index) => {
								if (isLoading) {
									return <SizeSkelation key={`radiussk-${size}`} />;
								}
								return (
									<div
										onClick={() =>
											setSvgSettings((prev) => ({ ...prev, radius: size }))
										}
										key={`radius-${size}`}
										className={cn(
											"zn:inline-flex zn:flex-1 zn:text-xs zn:items-center  zn:font-medium zn:gap-2 zn:p-2 zn:rounded zn:border zn:cursor-pointer zn:border-default-100 zn:bg-default-50",
											{
												"zn:bg-primary-50 zn:border-primary":
													svgSettings.radius === size,
											},
										)}
									>
										<div
											className={cn(
												"zn:h-4  zn:w-4 zn:border-[1.5px] zn:border-default-700  zn:rounded-full zn:transition-all zn:duration-150 zn:ring-2 zn:ring-inset zn:ring-offset-0  ",
												{
													"zn:ring-primary zn:bg-primary zn:ring-offset-4 zn:border-primary":
														svgSettings.radius === size,
													"zn:bg-white zn:ring-white":
														svgSettings.radius !== size,
												},
											)}
										></div>
										<span className=" zn:leading-none">
											{radiusLabels[size]}
										</span>
									</div>
								);
							})}
						</div>
					</div>
					{/* Background Color */}
					<div>
						<LabelTooltip
							label="Button Color"
							labelClassName="zn:text-[13px]"
							className="zn:mb-2"
							tooltip="Choose a background color for the button."
						/>

						<ColorPicker
							value={svgSettings.bgColor}
							onChange={(newColorObj) =>
								setSvgSettings((prev) => ({ ...prev, bgColor: newColorObj }))
							}
							disabled={["gradient"]}
						/>
					</div>
					{/* button location */}
					<div className="zn:flex zn:items-center zn:justify-between zn:pb-4">
						<LabelTooltip
							labelClassName="zn:text-[13px]"
							tooltipClassName="zn:max-w-[260px]"
							label="Navigation Mode"
							tooltip="Enable the Widget to switch from a floating icon to a fixed position on the Navigation Menu"
						/>
						<Switch
							id="nav-mode"
							checked={!!svgSettings.navMode}
							onCheckedChange={(checked) =>
								setSvgSettings((prev) => ({
									...prev,
									navMode: checked,
								}))
							}
						/>
					</div>
					{svgSettings.navMode ? null : (
						<>
							<div>
								<LabelTooltip
									className="zn:mb-2"
									label="Button Location"
									labelClassName="zn:text-[13px]"
									tooltip="You can always reposition the button later if the drag feature is enabled."
								/>
								<ButtonLocationSettings device={previewDevice} onDeviceChange={setPreviewDevice} />
							</div>
							<div className="zn:flex zn:items-center zn:justify-between zn:gap-2">
								<LabelTooltip
									labelClassName="zn:text-[13px]"
									label="Enable Drag Feature"
									tooltip="Allow the button to be draggable and repositioned anywhere on the screen"
								/>
								<Switch
									id="ec-position"
									checked={!!svgSettings.draggableEnabled}
									onCheckedChange={(val) =>
										setSvgSettings((prev) => ({
											...prev,
											draggableEnabled: val,
										}))
									}
								/>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Preview */}
			<div className="zn:lg:col-span-4 zn:col-span-12 zn:lg:block zn:hidden">
				<Card className="zn:sticky zn:top-10">
					<CardHeader>
						<CardTitle>Preview</CardTitle>
					</CardHeader>
					<CardContent>
						{svgSettings?.navMode === true ? (
							<NavPreview />
						) : (
							<ButtonPreview {...{ isLoading, svgSettings }} device={previewDevice} onDeviceChange={setPreviewDevice} />
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
