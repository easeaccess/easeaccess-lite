import { cn } from "@/lib/utils";
import { ThreeDot } from "@/icons";
import { Menu } from "lucide-react";
const PreviewBox = ({ device = "desktop", children, className }) => {
	return (
		<div
			className={cn(
				"zn:w-full zn:bg-[#f5f8ff] zn:rounded-sm zn:border zn:mt-6 p-4",
				{ "zn:w-48 zn:mx-auto": device === "mobile" },
			)}
		>
			<div
				className={cn(
					"zn:text-lg zn:text-primary-foreground zn:bg-primary zn:px-3 zn:rounded-t zn:py-2",
					{ "text-end": device === "mobile" },
				)}
			>
				{device === "mobile" ? <Menu className="zn:ms-auto" /> : <ThreeDot />}
			</div>

			<div
				className={cn(
					"zn:mt-4 zn:h-80 zn:pb-4 zn:bg-white zn:rounded zn:mx-4 zn:mb-4",
					className,
				)}
			>
				<div className="zn:relative zn:h-full">{children}</div>
			</div>
		</div>
	);
};

export default PreviewBox;
