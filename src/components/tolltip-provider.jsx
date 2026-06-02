import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AppTooltip({
	title = "tooltip Title",
	content,
	className,
	tooltipClassName,
}) {
	return (
		<div className={cn("zn:flex zn:items-center zn:gap-2", className)}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>{title}</div>
					</TooltipTrigger>
					<TooltipContent className={cn("zn:max-w-xs", tooltipClassName)}>
						<div className="zn:text-sm">{content}</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
