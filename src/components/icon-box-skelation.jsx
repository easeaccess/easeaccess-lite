import { Skeleton } from "./ui/skeleton";
const IconBoxSkelation = () => {
	return (
		<div className="zn:w-full zn:cursor-pointer zn:relative zn:rounded zn:border zn:border-default-100 zn:p-2 zn:flex zn:items-center zn:justify-center zn:px-13 zn:py-5 zn:bg-default-50 animate-pulse">
			{/* Skeleton for the circular icon container */}
			<Skeleton className="zn:h-10 zn:w-10 zn:rounded-full zn:bg-default-100 zn:flex zn:items-center zn:justify-center">
				{/* Skeleton for the inner icon symbol */}
				<Skeleton className="zn:h-6 zn:w-6 zn:rounded-full zn:bg-default-100" />
			</Skeleton>
		</div>
	);
};

export default IconBoxSkelation;
