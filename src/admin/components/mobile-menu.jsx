import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { tabs } from "@/constant/data";
import {
	Settings,
	FileCheck2,
	Settings2,
	MonitorCog,
	FileText,
	LockKeyhole,
	Menu,
	HelpCircle,
	ChevronRight,
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

export default function MobileMenu({ activeTab, changeTab }) {
	const [open, setOpen] = useState(false);

	const handleTabChange = (tab) => {
		changeTab(tab);
		setOpen(false);
	};

	return (
		<div className="zn:w-full zn:bg-white zn:border-b zn:border-default-200 zn:px-4 zn:py-3">
			<div className="zn:flex zn:items-center zn:justify-between">
				{/* Logo */}
				<div className="zn:flex zn:items-center zn:gap-2">
					<div className="zn:w-8 zn:h-8 zn:bg-primary zn:rounded-full zn:flex zn:items-center zn:justify-center">
						<svg
							width="26"
							height="26"
							viewBox="0 0 26 26"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect width="26" height="26" rx="13" fill="#2970FF" />
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12.9997 9.68421C14.017 9.68421 14.8418 8.85947 14.8418 7.84212C14.8418 6.82474 14.017 6 12.9997 6C11.9823 6 11.1576 6.82474 11.1576 7.84209C11.1576 8.85947 11.9823 9.68421 12.9997 9.68421ZM14.6311 19.5365L13.3351 16.6852C13.2042 16.3973 12.7952 16.3973 12.6643 16.6852L11.3683 19.5365C11.2399 19.8188 10.9585 20 10.6484 20C10.1494 20 9.77519 19.5435 9.87305 19.0542L10.9993 13.4227C11.0936 12.9514 10.8725 12.4732 10.4523 12.2398L8.23779 11.0095C7.99336 10.8737 7.8418 10.6161 7.8418 10.3365C7.8418 9.82498 8.33139 9.45568 8.82319 9.5962L12.0852 10.5282C12.6829 10.6989 13.3165 10.6989 13.9142 10.5282L17.1762 9.5962C17.668 9.45565 18.1576 9.82495 18.1576 10.3365C18.1576 10.6161 18.006 10.8737 17.7616 11.0095L15.547 12.2398C15.1269 12.4732 14.9057 12.9514 15 13.4227L16.1263 19.0542C16.2242 19.5435 15.8499 20 15.3509 20C15.0409 20 14.7594 19.8188 14.6311 19.5365Z"
								fill="white"
							/>
						</svg>
					</div>
					<span className="zn:text-lg zn:font-semibold zn:text-default-900">
						EaseAccess
					</span>
				</div>

				{/* Right Section */}
				<div className="zn:flex zn:items-center zn:gap-1">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="zn:p-2 zn:rounded-lg hover:zn:bg-default-100"
							>
								<Menu className="zn:w-5 zn:h-5 zn:text-default-600" />
							</Button>
						</SheetTrigger>

						<SheetContent
							side="right"
							className="zn:w-[300px] zn:p-0"
							hideCloseButton
						>
							<SheetHeader className="zn:p-6 zn:pb-4 zn:border-b zn:border-default-100">
								<div className="zn:flex zn:items-center zn:gap-2">
									<div className="zn:w-8 zn:h-8 zn:bg-primary zn:rounded-full zn:flex zn:items-center zn:justify-center">
										<svg
											width="26"
											height="26"
											viewBox="0 0 26 26"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<rect width="26" height="26" rx="13" fill="#2970FF" />
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												d="M12.9997 9.68421C14.017 9.68421 14.8418 8.85947 14.8418 7.84212C14.8418 6.82474 14.017 6 12.9997 6C11.9823 6 11.1576 6.82474 11.1576 7.84209C11.1576 8.85947 11.9823 9.68421 12.9997 9.68421ZM14.6311 19.5365L13.3351 16.6852C13.2042 16.3973 12.7952 16.3973 12.6643 16.6852L11.3683 19.5365C11.2399 19.8188 10.9585 20 10.6484 20C10.1494 20 9.77519 19.5435 9.87305 19.0542L10.9993 13.4227C11.0936 12.9514 10.8725 12.4732 10.4523 12.2398L8.23779 11.0095C7.99336 10.8737 7.8418 10.6161 7.8418 10.3365C7.8418 9.82498 8.33139 9.45568 8.82319 9.5962L12.0852 10.5282C12.6829 10.6989 13.3165 10.6989 13.9142 10.5282L17.1762 9.5962C17.668 9.45565 18.1576 9.82495 18.1576 10.3365C18.1576 10.6161 18.006 10.8737 17.7616 11.0095L15.547 12.2398C15.1269 12.4732 14.9057 12.9514 15 13.4227L16.1263 19.0542C16.2242 19.5435 15.8499 20 15.3509 20C15.0409 20 14.7594 19.8188 14.6311 19.5365Z"
												fill="white"
											/>
										</svg>
									</div>
									<span className="zn:text-lg zn:font-semibold zn:text-default-900">
										EaseAccess
									</span>
								</div>
							</SheetHeader>

							{/* Menu Items — same look as desktop Sidebar */}
							<div className="zn:!p-3">
								<nav className="zn:flex zn:flex-col zn:gap-1">
									{tabs?.map((tab) => {
										const Icon = tabIcons[tab] || Settings;
										const isActive = activeTab === tab;

										return (
											<button
												key={tab}
												type="button"
												onClick={() => handleTabChange(tab)}
												className={cn(
													"zn:flex zn:items-center zn:gap-2 zn:!px-3 zn:!py-2 zn:rounded zn:!text-sm zn:!font-medium zn:capitalize zn:cursor-pointer zn:transition-colors zn:text-default zn:bg-transparent zn:!border-0 zn:w-full zn:text-left",
													"hover:zn:!bg-gray-50 hover:zn:!text-default-900",
													isActive &&
														"zn:!bg-primary-50 zn:!text-primary hover:zn:!bg-primary-50",
												)}
											>
												<Icon className="zn:!w-4 zn:!h-4 zn:flex-none" />
												<span className="zn:text-left">
													{tabLabels[tab] || tab}
												</span>
											</button>
										);
									})}
								</nav>
							</div>

							{/* Footer */}
							<div className="zn:absolute zn:bottom-0 zn:left-0 zn:right-0 zn:p-4 zn:bg-default-50 zn:border-t zn:border-default-100">
								<div className="zn:flex zn:items-center zn:justify-between">
									<span className="zn:text-xs zn:text-default-500">v1.0.0</span>
									<div className="zn:flex zn:items-center zn:gap-2">
										<div className="zn:w-2 zn:h-2 zn:bg-green-500 zn:rounded-full" />
										<span className="zn:text-xs zn:text-default-500">
											Active
										</span>
									</div>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	);
}
