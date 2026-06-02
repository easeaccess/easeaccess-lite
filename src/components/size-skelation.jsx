import { Skeleton } from "./ui/skeleton";
const SizeSkelation = () => {
	return (
		<div className="zn:inline-flex zn:flex-1 zn:text-xs zn:items-center zn:font-medium zn:gap-2 zn:p-2 zn:rounded zn:border zn:border-default-100 zn:bg-default-50 zn:animate-pulse">
			{/* Skeleton for the radio button circle */}
			<Skeleton className="zn:h-4 zn:w-4 zn:rounded-full" />
			{/* Skeleton for the text label */}
			<Skeleton className="zn:h-4 zn:w-16 zn:rounded-md" />
		</div>
	);
};

export default SizeSkelation;
