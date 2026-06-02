import { useMediaQuery } from "@wordpress/compose";
const HeaderShape = ({ className, reverse = false, ...props }) => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	if (reverse === true) {
		return (
			<svg
				width={isMobile ? 263 : 342}
				height={isMobile ? 60 : 80}
				viewBox="0 0 366 80"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
				className={className}
			>
				<path
					d="M366 80H0L72.6234 0H293.375L366 80Z"
					fill="var(--zn-color-primary-icon)"
				/>
			</svg>
		);
	}
	return (
		<svg
			width={isMobile ? 263 : 342}
			height={isMobile ? 60 : 80}
			viewBox="0 0 342 80"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			className={className}
		>
			<path
				d="M340.011 6.89817C342.353 4.20069 340.437 0 336.865 0H5.13476C1.56263 0 -0.353401 4.20063 1.98832 6.89813L64.2027 78.5648C64.994 79.4764 66.1419 80 67.3491 80H274.649C275.856 80 277.004 79.4764 277.796 78.5648L340.011 6.89817Z"
				fill="var(--zn-color-primary-icon)"
			/>
		</svg>
	);
};
export default HeaderShape;
