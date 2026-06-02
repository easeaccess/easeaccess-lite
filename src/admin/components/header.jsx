import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@wordpress/compose";
import MobileMenu from "./mobile-menu";
import { HelpCircle } from "lucide-react";
import { AppTooltip } from "@/components/tolltip-provider";

export default function Header({ activeTab, changeTab }) {
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	// Mobile breakpoint keeps the slide-out hamburger menu.
	if (!isDesktop) {
		return <MobileMenu activeTab={activeTab} changeTab={changeTab} />;
	}

	// Desktop: minimal top bar — logo, version, help. Navigation lives in <Sidebar />.
	return (
		<header className="zn:!bg-white zn:!border-b zn:!border-gray-200 zn:!px-6 zn:!py-3 zn:!sticky zn:!top-[32px] zn:!z-30">
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
					<span className="zn:text-lg zn:font-semibold zn:text-gray-900">
						EaseAccess
					</span>
				</div>

				{/* Right side */}
				<div className="zn:flex zn:items-center zn:gap-4">
					<span className="zn:text-sm zn:text-default">
						Version {__EASEACCESS_VERSION__}
					</span>
					<AppTooltip
						title={
							<Button
								onClick={() =>
									window.open("https://easeaccess.io/support/", "_blank")
								}
								variant="ghost"
								size="sm"
								className="zn:p-2"
							>
								<HelpCircle className="zn:w-5 zn:h-5 zn:text-default" />
							</Button>
						}
						content="Help"
					/>
				</div>
			</div>
		</header>
	);
}
