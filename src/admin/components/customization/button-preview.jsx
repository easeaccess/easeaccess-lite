import { ThreeDot } from "../../../icons";
import { cn } from "../../../lib/utils";
import { useState } from "@wordpress/element";
import { Menu } from "lucide-react";
import FloatingButton from "./floating-button";
import PreviewBox from "@/components/preview-box";

const ButtonPreview = ({ isLoading, svgSettings, device: deviceProp, onDeviceChange }) => {
	const device = deviceProp || "desktop";
	const setDevice = onDeviceChange || (() => {});

	return (
		<div>
			{/* Device Toggle — commented out, synced from ButtonLocationSettings
			<div className="zn:w-full zn:bg-[#f5f8ff] zn:rounded-sm zn:p-1 zn:flex">
				{["desktop", "mobile"].map((d) => (
					<div
						key={d}
						className={cn(
							"zn:flex-1 zn:w-full zn:rounded-sm zn:p-3 zn:block zn:cursor-pointer zn:text-center zn:text-xs",
							{
								"zn:bg-white zn:text-primary zn:font-medium": device === d,
							},
						)}
						onClick={() => setDevice(d)}
					>
						{d.charAt(0).toUpperCase() + d.slice(1)}
					</div>
				))}
			</div>
			*/}

			{/* Preview */}
			<PreviewBox device={device}>
				{isLoading ? (
					<div className="zn:relative zn:flex zn:h-10 zn:w-10 zn:items-center zn:justify-center zn:rounded-full zn:bg-gray-200 zn:shadow-md zn:animate-pulse">
						<div className="zn:absolute zn:h-8 zn:w-8 zn:rounded-full zn:border-2 zn:border-gray-300 zn:bg-gray-200"></div>
						<div className="zn:h-6 zn:w-6 zn:rounded-full zn:bg-gray-300 zn:z-10"></div>
					</div>
				) : (
					<FloatingButton device={device} svgSettings={svgSettings} />
				)}
			</PreviewBox>
		</div>
	);
};

export default ButtonPreview;
