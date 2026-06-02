import { ArrowLeft, BookOpen, Code, Link, Link2Off } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { Badge } from "@/components/ui/badge";

export default function PageStructureView({
	data,
	activeTab,
	setActiveTab,
	onBack,
	scrollHandlers,
}) {
	const { __ } = useTranslation();
	if (!data) return null;
	return (
		<div className="zn:!text-primary-icon-foreground zn:!p-4">
			<div className="zn:flex zn:items-center zn:justify-between">
				<span
					onClick={() => {
						onBack();
						setActiveTab("headings");
					}}
					className="zn:flex zn:items-center zn:gap-2 zn:cursor-pointer"
				>
					<ArrowLeft className="zn:size-5" />
					<span>{__("Back", "easeaccess")}</span>
				</span>
			</div>
			<div className="zn:text-center zn:!mb-6">
				<div className="zn:font-semibold zn:!text-xl zn:!mb-2">
					{__("Page Structure", "easeaccess")}
				</div>
				<div className="zn:font-normal zn:!text-sm">
					{__("Navigate through page elements", "easeaccess")}
				</div>
			</div>
			<div className="zn:!bg-gray-50 zn:rounded-[20px] zn:!p-4">
				<div className="zn:flex zn:!mb-4 zn:!bg-white zn:rounded-lg zn:!p-1">
					{["headings", "landmarks", "links"].map((tab) => (
						<span
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={cn(
								"zn:flex-1 zn:!py-2 zn:!px-3 zn:rounded-md zn:font-medium zn:text-sm zn:transition",
								activeTab === tab
									? "zn:!bg-primary-icon zn:!text-white"
									: "zn:!text-gray-600 zn:hover:!text-gray-900",
							)}
						>
							{__(tab.charAt(0).toUpperCase() + tab.slice(1), "easeaccess")} (
							{data[tab].length})
						</span>
					))}
				</div>
				<div className="zn:!mt-4">
					{activeTab === "headings" && data.headings.length > 0 && (
						<div className="zn:space-y-2 zn:max-h-[400px] zn:overflow-y-auto">
							{data.headings.map((heading, idx) => {
								const indent = (parseInt(heading.level[1]) - 1) * 16;
								return (
									<div
										key={idx}
										style={{ paddingLeft: `${indent}px` }}
										className="zn:!py-3 zn:!px-4 zn:group zn:!flex zn:!gap-2  zn:!bg-white zn:rounded-md zn:hover:!bg-gray-100 zn:transition zn:cursor-pointer zn:!text-sm  zn:!break-words zn:!line-clamp-3 "
										onClick={(e) => scrollHandlers.onHeading(e, heading)}
									>
										<Badge className=" zn:!flex-none zn:!text-primary-foreground zn:uppercase zn:!bg-primary">
											{heading.level}
										</Badge>
										<span className="zn:!ml-2 zn:!flex-1 zn:!text-gray-900 zn:group-hover:underline  ">
											{heading.text}
										</span>
									</div>
								);
							})}
						</div>
					)}
					{activeTab === "landmarks" && data.landmarks.length > 0 && (
						<div className="zn:space-y-2 zn:max-h-[400px] zn:overflow-y-auto">
							{data.landmarks.map((landmark, idx) => (
								<div
									key={idx}
									className="zn:!py-3 zn:!px-4 zn:!bg-white zn:rounded-md zn:hover:!bg-gray-100 zn:transition zn:cursor-pointer zn:!text-sm zn:!break-words zn:!line-clamp-3"
									onClick={(e) => scrollHandlers.onLandmark(e, landmark)}
								>
									<Badge variant="secondary" className="zn:!me-2 zn:uppercase">
										<Code />
									</Badge>
									<span className="zn:font-semibold zn:!text-gray-700">
										&lt;{landmark.tag}&gt;
									</span>
									{landmark.role && (
										<span className="zn:!ms-2 zn:!text-sm zn:!text-gray-600">
											role="{landmark.role}"
										</span>
									)}
									{landmark.ariaLabel && (
										<span className="zn:!ms-2 zn:!text-sm zn:!text-gray-800">
											- {landmark.ariaLabel}
										</span>
									)}
								</div>
							))}
						</div>
					)}
					{activeTab === "links" && data.links.length > 0 && (
						<div className="zn:space-y-2 zn:max-h-[400px] zn:overflow-y-auto ">
							{data.links.map((link, idx) => (
								<div
									key={idx}
									className="zn:!py-3 zn:!flex zn:!px-4 zn:gap-2 zn:group zn:!bg-white zn:group zn:rounded-md zn:hover:!bg-gray-100 zn:transition zn:!text-sm  zn:!break-words zn:!line-clamp-3"
								>
									<Badge>
										<Link2Off />
									</Badge>
									<a
										href={link.href}
										target="_blank"
										className="zn:!text-primary  zn:block  zn:group-hover:!underline zn:!text-sm"
										title={link.text || link.href}
									>
										{link.text || link.href}
									</a>
								</div>
							))}
						</div>
					)}
					{activeTab === "headings" && data.headings.length === 0 && (
						<div className="zn:text-center zn:!py-8 zn:!text-gray-500">
							{__("No headings found on this page", "easeaccess")}
						</div>
					)}
					{activeTab === "landmarks" && data.landmarks.length === 0 && (
						<div className="zn:text-center zn:!py-8 zn:!text-gray-500">
							{__("No landmarks found on this page", "easeaccess")}
						</div>
					)}
					{activeTab === "links" && data.links.length === 0 && (
						<div className="zn:text-center zn:!py-8 zn:!text-gray-500">
							{__("No links found on this page", "easeaccess")}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
