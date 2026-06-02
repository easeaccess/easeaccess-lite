import { Fragment } from "@wordpress/element";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "../../../components/ui/tooltip";

import { cn } from "../../../lib/utils";
const positions = [
	"top-left",
	"top-center",
	"top-right",
	"center-left",
	"center-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
];
import { Skeleton } from "../../../components/ui/skeleton";
export default function PositionSelector({
	selectedPosition,
	onSelect,
	isLoading,
	isMobile = false,
}) {
	if (isLoading) {
		return (
			<div className="zn:grid zn:grid-cols-3 grid-flow-col zn:gap-6">
				{positions.map((_, index) => {
					const isLastItem = [2, 4, 7].includes(index);
					const isCenterItem = [1, 6].includes(index);
					return (
						<Fragment key={index}>
							<Skeleton
								className={cn(
									"zn:size-6 zn:rounded-full", // Matches the outer circle size and shape
									isLastItem && "zn:ms-auto",
									isCenterItem && "zn:mx-auto",
								)}
							/>
							{index === 3 && <div className="zn:blank" />}
						</Fragment>
					);
				})}
			</div>
		);
	}
	return (
		<div className="zn:grid zn:grid-cols-3 grid-flow-col zn:gap-6">
			{positions.map((pos, index) => {
				const isLastItem = [2, 4, 7].includes(index);
				const isCenterItem = [1, 6].includes(index);
				const isCenterPosition = pos.includes("-center");
				const isDisabled = isMobile && isCenterPosition;

				return (
					<Fragment key={pos}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div
									className={cn(
										"zn:size-6 zn:rounded-full zn:border-2 zn:flex zn:items-center zn:justify-center zn:transition-colors",
										isDisabled
											? "zn:cursor-not-allowed zn:opacity-30 zn:border-gray-200"
											: "zn:cursor-pointer",
										!isDisabled && selectedPosition === pos
											? "zn:border-blue-500"
											: !isDisabled && "zn:border-gray-300",
										isLastItem && "zn:ms-auto",
										isCenterItem && "zn:mx-auto",
									)}
									onClick={() => !isDisabled && onSelect(pos)}
									role="radio"
									aria-checked={selectedPosition === pos}
									aria-disabled={isDisabled}
									tabIndex={isDisabled ? -1 : 0}
								>
									<div
										className={cn(
											"zn:size-2 zn:rounded-full zn:transition-colors",
											!isDisabled && selectedPosition === pos
												? "zn:bg-blue-600"
												: "zn:bg-transparent",
										)}
									/>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								{isDisabled ? `${pos} (Not available on mobile)` : pos}
							</TooltipContent>
						</Tooltip>
						{index === 3 && <div className="zn:blank" />}
					</Fragment>
				);
			})}
		</div>
	);
}
