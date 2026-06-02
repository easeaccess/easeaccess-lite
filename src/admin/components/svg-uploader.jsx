// Svguploader.jsx
"use client";

import { useContext, useEffect, useRef, useState } from "@wordpress/element";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import {
	Heart,
	Star,
	Home,
	User,
	Settings,
	Mail,
	Phone,
	Camera,
	Music,
	Play,
	Pause,
	Download,
	Upload,
	Search,
	Bell,
	Calendar,
	Aperture,
	Eye,
	Zap,
	MousePointer,
	Accessibility,
	Users,
	Shield,
} from "lucide-react";
import useSvgCustomizer from "../../hooks/use-svg-settings";
import AccessiblyContext from "../../context/accessibly-context";

const predefinedIcons = [
	{ name: "Heart", icon: Heart },
	{ name: "Star", icon: Star },
	{ name: "Home", icon: Home },
	{ name: "User", icon: User },
	{ name: "Settings", icon: Settings },
	{ name: "Mail", icon: Mail },
	{ name: "Phone", icon: Phone },
	{ name: "Camera", icon: Camera },
	{ name: "Music", icon: Music },
	{ name: "Play", icon: Play },
	{ name: "Pause", icon: Pause },
	{ name: "Download", icon: Download },
	{ name: "Search", icon: Search },
	{ name: "Bell", icon: Bell },
	{ name: "Calendar", icon: Calendar },
	{ name: "Aperture", icon: Aperture },
	{ name: "Eye", icon: Eye },
	{ name: "Zap", icon: Zap },
	{ name: "Mouse Pointer", icon: MousePointer },
	{ name: "Accessibility", icon: Accessibility },
	{ name: "Users", icon: Users },
	{ name: "Shield", icon: Shield },
];

const backgroundColors = [
	{ name: "White", value: "#ffffff" },
	{ name: "Light Gray", value: "#f3f4f6" },
	{ name: "Blue", value: "#3b82f6" },
	{ name: "Green", value: "#10b981" },
	{ name: "Purple", value: "#8b5cf6" },
	{ name: "Red", value: "#ef4444" },
	{ name: "Yellow", value: "#f59e0b" },
	{ name: "Pink", value: "#ec4899" },
	{ name: "Indigo", value: "#6366f1" },
	{ name: "Black", value: "#000000" },
];

export default function Svguploader() {
	const {
		setFeatures,
		svgSettings,
		setSvgSettings,
		saveSettings,
		isSaving,
		isLoading,
	} = useContext(AccessiblyContext);

	const [selectedIcon, setSelectedIcon] = useState(Heart);

	// useEffect(() => { loadSettings() }, [])

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
					setSvgSettings({ ...svgSettings, customSvg: svgContent });
					setSelectedIcon(null);
					localStorage.setItem("customSvgUrl", url);
				});
		});
	};

	const renderIcon = () => {
		if (svgSettings?.customSvg && svgSettings.processedSvg) {
			return (
				<div
					dangerouslySetInnerHTML={{ __html: svgSettings.processedSvg }}
					className="zn:flex zn:items-center zn:justify-center"
					style={{
						width: svgSettings?.fontSize[0],
						height: svgSettings?.fontSize[0],
						minWidth: svgSettings?.fontSize[0],
						minHeight: svgSettings?.fontSize[0],
						maxWidth: svgSettings?.fontSize[0],
						maxHeight: svgSettings?.fontSize[0],
					}}
				/>
			);
		} else if (selectedIcon) {
			const IconComponent = selectedIcon;
			return (
				<IconComponent
					size={svgSettings?.fontSize[0]}
					color={svgSettings?.iconColor}
				/>
			);
		}
		return null;
	};

	return (
		<div className="zn:grid zn:grid-cols-12 zn:gap-6 zn:relative zn:max-w-7xl zn:mx-auto">
			<Card className="zn:col-span-8">
				<CardHeader>
					<CardTitle>SVG Icon Manager</CardTitle>
				</CardHeader>
				<CardContent className="zn:space-y-6">
					<div>
						<Label className="zn:text-lg zn:font-semibold zn:mb-4 zn:block">
							Available Icons
						</Label>
						<div className="zn:grid zn:grid-cols-5 sm:zn:grid-cols-8 md:zn:grid-cols-10 zn:gap-3">
							{predefinedIcons.map((iconItem) => {
								const IconComponent = iconItem.icon;
								return (
									<Button
										key={iconItem.name}
										variant={
											selectedIcon === iconItem.icon && !svgSettings?.customSvg
												? "default"
												: "outline"
										}
										size="sm"
										className="zn:p-3 zn:h-12 zn:w-12"
										onClick={() => {
											setSelectedIcon(iconItem.icon);
											setSvgSettings({
												...svgSettings,
												customSvg: null,
												processedSvg: null,
											});
										}}
										title={iconItem.name}
									>
										<IconComponent size={20} />
									</Button>
								);
							})}
						</div>
					</div>

					<div>
						<Label className="zn:text-lg zn:font-semibold zn:mb-4 zn:block">
							Upload Custom SVG
						</Label>
						<div className="zn:flex zn:items-center zn:gap-4">
							<Button
								onClick={handleMediaUpload}
								variant="outline"
								className="zn:flex zn:items-center zn:gap-2"
							>
								<Upload size={16} /> Upload SVG
							</Button>
						</div>
					</div>

					<div className="zn:grid md:zn:grid-cols-2 zn:gap-6">
						<div>
							<Label className="zn:text-lg zn:font-semibold zn:mb-4 zn:block">
								Icon Size: {svgSettings.fontSize}px
							</Label>

							<Slider
								value={[svgSettings.fontSize ?? 24]}
								onValueChange={([newSize]) => {
									setSvgSettings((prev) => ({
										...prev,
										fontSize: newSize,
									}));
								}}
								max={100}
								min={16}
								step={2}
								className="zn:w-full"
							/>
							<div className="zn:flex zn:justify-between zn:text-sm zn:text-gray-500 zn:mt-1">
								<span>16px</span>
								<span>100px</span>
							</div>
						</div>
						<div>
							<Label className="zn:text-lg zn:font-semibold zn:mb-4 zn:block">
								Icon Color
							</Label>
							<div className="zn:flex zn:items-center zn:gap-4">
								<Input
									type="color"
									value={svgSettings.iconColor}
									onChange={(e) =>
										setSvgSettings((prev) => ({
											...prev,
											iconColor: e.target.value,
										}))
									}
									className="zn:w-16 zn:h-10 zn:p-1 zn:border zn:rounded"
								/>
								<span className="zn:text-sm zn:text-gray-600">
									{svgSettings.iconColor}
								</span>
							</div>
						</div>
					</div>

					<div>
						<Label className="zn:text-lg zn:font-semibold zn:mb-4 zn:block">
							Background Color
						</Label>
						<div className="zn:grid zn:grid-cols-5 sm:zn:grid-cols-10 zn:gap-2">
							{backgroundColors.map((color) => (
								<Button
									key={color.value}
									variant={
										svgSettings?.backgroundColor === color.value
											? "default"
											: "outline"
									}
									className="zn:h-12 zn:w-full zn:p-1"
									onClick={() =>
										setSvgSettings((prev) => ({
											...prev,
											backgroundColor: color.value,
										}))
									}
									title={color.name}
								>
									<div
										className="zn:w-full zn:h-full zn:rounded zn:border"
										style={{ backgroundColor: color.value }}
									/>
								</Button>
							))}
						</div>
						<div className="zn:mt-4 zn:flex zn:items-center zn:gap-4">
							<Label>Custom Color:</Label>
							<Input
								type="color"
								value={svgSettings.backgroundColor}
								onChange={(e) =>
									setSvgSettings((prev) => ({
										...prev,
										backgroundColor: e.target.value,
									}))
								}
								className="zn:w-16 zn:h-10 zn:p-1 zn:border zn:rounded"
							/>
							<span className="zn:text-sm zn:text-gray-600">
								{svgSettings.backgroundColors}
							</span>
						</div>
					</div>

					<div className="zn:flex zn:justify-end zn:mt-6">
						<Button
							onClick={saveSettings}
							disabled={isSaving}
							className="zn:flex zn:items-center zn:gap-2"
							variant={"default"}
						>
							<Upload size={16} />
							{isSaving ? <> Saving...</> : <> Save Settings</>}
						</Button>
					</div>
				</CardContent>
			</Card>

			<div className="zn:col-span-4">
				<Card className="zn:sticky zn:top-10">
					<CardHeader>
						<CardTitle>Preview</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="zn:flex zn:justify-center">
							<div
								className="zn:p-8 zn:rounded-lg zn:border-2 zn:border-dashed zn:border-gray-300 zn:flex zn:items-center zn:justify-center zn:min-w-[120px] zn:min-h-[120px]"
								style={{ backgroundColor: svgSettings.backgroundColor }}
							>
								{isLoading ? (
									<div className=" zn:size-6 zn:animate-spin zn:border-2 zn:border-blue-500 zn:rounded-md "></div>
								) : (
									renderIcon()
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
