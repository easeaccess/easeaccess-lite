import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function LabelTooltip({
	label,
	tooltip,
	htmlFor,
	required = false,
	className,
	tooltipClassName,
	iconClassName,
	labelClassName,
}) {
	return (
		<div className={cn("zn:flex zn:items-center zn:gap-2", className)}>
			<Label
				htmlFor={htmlFor}
				className={cn(
					"zn:text-sm zn:font-normal zn:text-default-800",
					labelClassName,
				)}
			>
				{label}
				{required && <span className="zn:text-destructive zn:ml-1">*</span>}
			</Label>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Info
							className={cn(
								"zn:h-3.5 zn:w-3.5 zn:text-default-400 zn:hover:text-foreground zn:cursor-help",
								iconClassName,
							)}
						/>
					</TooltipTrigger>
					<TooltipContent className={cn("zn:w-max", tooltipClassName)}>
						<div className="zn:text-sm  zn:break-words   ">{tooltip}</div>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
