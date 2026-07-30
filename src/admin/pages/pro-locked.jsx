import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { proTabLabels } from "@/constant/data";

const PRO_UPGRADE_URL = "https://easeaccess.io/pricing/";

/**
 * Full-page teaser shown when a site owner opens a Pro-only menu item in Lite.
 * Purely informational — it advertises the separate EaseAccess Pro plugin.
 * No Pro functionality exists here.
 */
export default function ProLockedPage({ tab }) {
	const label = proTabLabels[tab] || "This feature";

	return (
		<Card className="zn:max-w-xl zn:mx-auto zn:mt-10">
			<CardContent className="zn:text-center zn:py-12">
				<span className="zn:inline-flex zn:rounded-full zn:mb-6 zn:size-16 zn:items-center zn:justify-center zn:bg-warning-light">
					<Crown className="zn:text-warning zn:size-8" />
				</span>
				<h2 className="zn:text-xl zn:font-bold zn:text-default-800 zn:mb-2">
					{label} is an EaseAccess Pro feature
				</h2>
				<p className="zn:text-sm zn:text-gray-500 zn:mb-6 zn:max-w-md zn:mx-auto">
					Upgrade to EaseAccess Pro to unlock {label} along with other advanced
					accessibility tools.
				</p>
				<Button
					className="zn:bg-warning zn:hover:bg-warning/90 zn:cursor-pointer"
					onClick={() => window.open(PRO_UPGRADE_URL, "_blank")}
				>
					Upgrade Now
				</Button>
			</CardContent>
		</Card>
	);
}
