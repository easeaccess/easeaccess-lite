import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";

const PRO_UPGRADE_URL = "https://easeaccess.io/pricing/";

/**
 * A "PRO" badge with an upgrade hover-card. Purely informational — it points
 * the site owner to the separate EaseAccess Pro plugin. No feature is unlocked
 * or gated locally; nothing here runs any Pro code.
 */
export default function ProBadge() {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<span className="zn:cursor-pointer zn:inline-flex">
					<Badge
						variant="outline"
						className="zn:text-xs zn:px-2 zn:py-0 zn:border-warning zn:text-warning zn:bg-warning-light"
					>
						PRO
					</Badge>
				</span>
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
						This feature is available in EaseAccess Pro. Upgrade for advanced
						customization and pro tools to boost your site.
					</div>
					<div className="zn:mt-2">
						<Button
							className="zn:w-full zn:cursor-pointer zn:bg-warning zn:hover:bg-warning/90"
							onClick={() => window.open(PRO_UPGRADE_URL, "_blank")}
						>
							Upgrade Now
						</Button>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
