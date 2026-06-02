import { tabs } from "@/constant/data";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@wordpress/compose";
import {
	Settings,
	FileCheck2,
	Settings2,
	MonitorCog,
	FileText,
	LockKeyhole,
	Sparkles,
} from "lucide-react";

const tabIcons = {
	general: Settings,
	"one-click": Sparkles,
	scans: FileCheck2,
	"ai-settings": Sparkles,
	customization: Settings2,
	features: MonitorCog,
	statement: FileText,
	license: LockKeyhole,
};

const tabLabels = {
	"one-click": "One-Click",
	"ai-settings": "AI Settings",
};

export default function Sidebar({ activeTab, changeTab }) {
	// Match the same breakpoint used by Header so we never end up with a
	// MobileMenu in the header AND an empty desktop sidebar.
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	if (!isDesktop) return null;

	return (
		<aside className="zn:flex zn:flex-col zn:w-56 zn:flex-none zn:!border-r zn:!border-gray-200 zn:!bg-white zn:!self-stretch zn:!sticky zn:!top-[78px] zn:!h-[calc(100vh-78px)]">
			<nav className="zn:flex zn:flex-col zn:gap-1 zn:!p-3">
				{tabs?.map((tab) => {
					const Icon = tabIcons[tab];
					const isActive = activeTab === tab;
					return (
						<button
							key={tab}
							type="button"
							onClick={() => changeTab(tab)}
							className={cn(
								"zn:flex zn:items-center zn:gap-2 zn:!px-3 zn:!py-2 zn:rounded zn:!text-sm zn:!font-medium zn:capitalize zn:cursor-pointer zn:transition-colors zn:text-default zn:bg-transparent zn:!border-0 zn:w-full",
								"hover:zn:!bg-gray-50 hover:zn:!text-default-900",
								isActive &&
									"zn:!bg-primary-50 zn:!text-primary hover:zn:!bg-primary-50",
							)}
						>
							<Icon className="zn:!w-4 zn:!h-4 zn:flex-none" />
							<span className="zn:text-left">{tabLabels[tab] || tab}</span>
						</button>
					);
				})}
			</nav>
		</aside>
	);
}
