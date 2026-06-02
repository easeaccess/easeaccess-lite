import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

import { Type, AlignLeft, Layout, BookOpen, Link, X } from "lucide-react";
import {
	predefinedIcons,
	sizes,
	radius,
	sizeLabels,
} from "../../constant/data";
import { cn, getContrastTextColor } from "../../lib/utils";
import RenderIcon from "@/components/render-icon";

export default function AccessibilityWidget() {
	const [open, setOpen] = useState(false);
	// Initialize with saved position to prevent flicker
	const [svgSettings, setSvgSettings] = useState(() => {
		// Try to get saved settings immediately to prevent position flicker
		if (typeof window !== "undefined") {
			try {
				const saved = localStorage.getItem("svgSettings");
				if (saved) {
					const parsed = JSON.parse(saved);
					// Return at least the position to prevent flicker
					return {
						buttonPosition: parsed.buttonPosition || "bottom-right",
						buttonPositionMobile: parsed.buttonPositionMobile || "bottom-right",
						size: parsed.size || "sm",
						radius: parsed.radius || "sm",
						bgColor: parsed.bgColor || { color: "#155eef" },
						...parsed,
					};
				}
			} catch (e) {
				console.warn("Error parsing saved settings:", e);
			}
		}
		// Fallback defaults
		return {
			buttonPosition: "bottom-right",
			buttonPositionMobile: "bottom-right",
			size: "sm",
			radius: "sm",
			bgColor: { color: "#155eef" },
		};
	});
	const [statementSettings, setStatementSettings] = useState({});

	useEffect(() => {
		async function fetchSettings() {
			try {
				const data = await apiFetch({ path: "/easeaccess-lite/v1/widget-settings" });
				setSvgSettings(data.svgSettings || {});

				// Set statement settings directly from public endpoint
				if (data.statementSettings && data.statementSettings.widget_enabled) {
					setStatementSettings(data.statementSettings);
				}
			} catch (error) {
				console.error("Error fetching settings:", error);
			}
		}

		fetchSettings();
	}, []);
	// renderIcon now centralized via <RenderIcon /> component
	console.log(svgSettings, "front end");
	return (
		<div
			style={{ "--primary-icon": svgSettings?.bgColor?.color }}
			id="accessibility-widget"
			className="accessibility-widget-ready"
		>
			<div
				onClick={() => setOpen(true)}
				className={cn(
					"zn:fixed zn:z-[99999] zn:cursor-pointer zn:text-white zn:flex zn:items-center zn:justify-center zn:!bg-primary-icon",
					{
						"zn:h-10 zn:w-10": svgSettings.size === "sm",
						"zn:h-12 zn:w-12": svgSettings.size === "md",
						"zn:h-16 zn:w-16": svgSettings.size === "lg",
						"zn:rounded-md": svgSettings.radius === "sm",
						"zn:rounded-xl": svgSettings.radius === "md",
						"zn:rounded-full": svgSettings.radius === "lg",
						// Position classes - default to bottom-right if no position is set
						"zn:bottom-6 zn:end-6":
							svgSettings.buttonPosition === "bottom-right" ||
							!svgSettings.buttonPosition,
						"zn:bottom-6 zn:start-6":
							svgSettings.buttonPosition === "bottom-left",
						"zn:top-6 zn:end-6": svgSettings.buttonPosition === "top-right",
						"zn:top-6 zn:start-6": svgSettings.buttonPosition === "top-left",
						"zn:top-1/2 zn:-translate-y-1/2 zn:end-6":
							svgSettings.buttonPosition === "center-right",
						"zn:top-1/2 zn:-translate-y-1/2 zn:start-6":
							svgSettings.buttonPosition === "center-left",
						"zn:top-6 zn:-translate-x-1/2 zn:start-1/2":
							svgSettings.buttonPosition === "top-center",
						"zn:bottom-6 zn:-translate-x-1/2 zn:start-1/2":
							svgSettings.buttonPosition === "bottom-center",
					},
				)}
			>
				<div
					className={cn(
						"zn:absolute  zn:rounded-full zn:!border-2 zn:border-white zn:!bg-primary-icon",
						{
							"zn:h-8 zn:w-8": svgSettings.size === "sm",
							"zn:h-10 zn:w-10": svgSettings.size === "md",
							"zn:h-14 zn:w-14": svgSettings.size === "lg",
							"zn:rounded-md ": svgSettings.radius === "sm",
							"zn:rounded-xl ": svgSettings.radius === "md",
							"zn:rounded-full ": svgSettings.radius === "lg",
						},
					)}
				></div>
				{renderIcon()}
			</div>

			{open && (
				<div className="zn:fixed zn:bottom-20 zn:right-4 zn:!bg-white zn:shadow-lg zn:rounded-lg zn:p-4 zn:w-72 zn:z-50 zn:!border editor-box">
					<div className="zn:flex zn:justify-between zn:items-center zn:mb-4">
						<h3 className="font-bold text-lg">Accessibility Features</h3>
						<button onClick={() => setOpen(false)}>
							<X className="zn:w-4 zn:h-4" />
						</button>
					</div>

					<div className="zn:space-y-3">
						{/* Accessibility Tools Grid */}
						<div className="zn:grid zn:grid-cols-3 zn:gap-2">
							<button className="zn:flex zn:flex-col zn:items-center zn:gap-1 zn:p-2 zn:rounded zn:hover:bg-gray-100">
								<Type className="zn:w-5 zn:h-5" />
								<span className="zn:text-xs">Text Size</span>
							</button>
							<button className="zn:flex zn:flex-col zn:items-center zn:gap-1 zn:p-2 zn:rounded zn:hover:bg-gray-100">
								<AlignLeft className="zn:w-5 zn:h-5" />
								<span className="zn:text-xs">Contrast</span>
							</button>
							<button className="zn:flex zn:flex-col zn:items-center zn:gap-1 zn:p-2 zn:rounded zn:hover:bg-gray-100">
								<Layout className="zn:w-5 zn:h-5" />
								<span className="zn:text-xs">Layout</span>
							</button>
						</div>

						{/* Statement Link */}
						{statementSettings?.widget_enabled &&
							statementSettings?.page_url && (
								<div className="zn:border-t zn:pt-3">
									<a
										href={statementSettings.page_url}
										target="_blank"
										rel="noopener noreferrer"
										className="zn:flex zn:items-center zn:gap-2 zn:p-2 zn:rounded zn:bg-blue-50 zn:text-blue-700 zn:hover:bg-blue-100 zn:transition-colors zn:text-sm"
									>
										<BookOpen className="zn:w-4 zn:h-4" />
										<span>
											{statementSettings.link_text || "Accessibility Statement"}
										</span>
										<Link className="zn:w-3 zn:h-3 zn:ml-auto" />
									</a>
								</div>
							)}
					</div>
				</div>
			)}
		</div>
	);
}
