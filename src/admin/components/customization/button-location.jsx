import { useState, Fragment, useContext } from "@wordpress/element";

import { cn } from "../../../lib/utils";
import PositionSelector from "./position-selector";

import AccessiblyContext from "../../../context/accessibly-context";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// 🔧 Main Component
export default function ButtonLocationSettings({ device, onDeviceChange }) {
	const { svgSettings, setSvgSettings, isLoading } =
		useContext(AccessiblyContext);
	const activeTab = device || "desktop";
	const setActiveTab = onDeviceChange || (() => {});

	const isDesktop = activeTab === "desktop";

	return (
		<div className="zn:flex zn:items-center zn:justify-center">
			<div className=" zn:bg-[#f5f8ff] zn:w-full ">
				{/* Tab Buttons */}
				<div className="zn:w-full zn:bg-[#f5f8ff] zn:rounded-sm zn:p-1 zn:flex zn:mb-6">
					{["desktop", "mobile"].map((tab) => (
						<span
							key={tab}
							className={cn(
								"zn:flex-1 zn:p-3 zn:text-xs zn:text-center zn:cursor-pointer zn:rounded-sm",
								activeTab === tab &&
									"zn:bg-white zn:text-primary zn:font-medium",
							)}
							onClick={() => setActiveTab(tab)}
						>
							Button Location {tab.charAt(0).toUpperCase() + tab.slice(1)}
						</span>
					))}
				</div>

				{/* Position Grid + Offset Controls */}
				<div className="zn:flex md:zn:flex-row zn:gap-6 zn:bg-[#f5f8ff] zn:rounded-sm zn:p-4">
					<div
						className={cn(
							"zn:flex-1 zn:p-4 zn:border-2 zn:border-gray-900 zn:rounded-md zn:bg-card zn:max-w-[300px]",
							{
								"zn:ms-auto": activeTab !== "desktop",
							},
						)}
					>
						<PositionSelector
							selectedPosition={
								isDesktop
									? svgSettings.buttonPosition
									: svgSettings.buttonPositionMobile
							}
							onSelect={(pos) =>
								setSvgSettings((prev) => ({
									...prev,
									[isDesktop ? "buttonPosition" : "buttonPositionMobile"]: pos,
								}))
							}
							isLoading={isLoading}
							isMobile={!isDesktop}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
