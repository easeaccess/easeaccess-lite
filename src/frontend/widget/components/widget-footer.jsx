import { cn } from "@/lib/utils";
import {
	BookOpen,
	Forward,
	Link,
	NotepadText,
	PersonStanding,
} from "lucide-react";
import HeaderShape from "./header-shape";
import FrontEndLogo from "./front-end-logo";
import { useMediaQuery } from "@wordpress/compose";
export default function WidgetFooter({
	svgSettings,
	statementLinkData,
	isPopover,
	theme,
	resetAll,
}) {
	const isMobile = useMediaQuery("(max-width: 768px)");
	if (theme === "default" && !isMobile) {
		return (
			<div className="zn:relative  zn:flex-none">
				<div className="zn:absolute zn:bottom-0 zn:left-1/2 zn:-translate-x-1/2 zn:max-w-[345px] zn:!ms-[5px]">
					<HeaderShape reverse={true} />
					<div className="zn:absolute zn:start-0 zn:bottom-0 zn:w-full zn:h-full zn:flex zn:flex-col zn:items-center zn:justify-center zn:z-50">
						{!svgSettings.hideLogo && (
							<span className="zn:md:!text-base zn:!text-xs zn:!text-primary-icon-foreground zn:flex zn:gap-2 zn:items-center">
								<FrontEndLogo height={24} width={24} />
								EaseAccess
							</span>
						)}
						{statementLinkData && typeof statementLinkData === "object" && (
							<a
								key="accessibility-statement"
								href={statementLinkData.url}
								target="_blank"
								rel="noopener noreferrer"
								className="zn:!text-primary-icon-foreground zn:md:!mt-2  zn:inline-flex zn:items-center zn:md:!text-xs zn:!text-[11px]"
							>
								{statementLinkData.text || "Accessibility Statement"}
								<Forward className="zn:ms-1 zn:size-3" />
							</a>
						)}
					</div>
				</div>
			</div>
		);
	}
	if (theme === "default" && isMobile) {
		return (
			<div className="zn:relative  zn:flex-none">
				<div className="zn:absolute zn:bottom-0 zn:left-1/2 zn:-translate-x-1/2">
					<HeaderShape reverse={true} />
					<div className="zn:absolute zn:start-0 zn:bottom-0 zn:w-full zn:h-full zn:flex zn:flex-col zn:items-center zn:justify-center zn:z-50">
						<div className="zn:flex zn:gap-2.5 zn:items-center zn:justify-between">
							{statementLinkData && typeof statementLinkData === "object" && (
								<div>
									<a
										key="accessibility-statement"
										href={statementLinkData.url}
										target="_blank"
										rel="noopener noreferrer"
										className="zn:!text-primary-icon-foreground  zn:inline-flex zn:items-center zn:!text-[13px]"
									>
										<NotepadText className="zn:me-1 zn:size-3.5" />
										{statementLinkData.text || "Accessibility Statement"}
									</a>
								</div>
							)}
							{statementLinkData && typeof statementLinkData === "object" && (
								<div className="zn:!text-primary-icon-foreground ">
									<svg
										width={1}
										height={16}
										viewBox="0 0 1 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<line
											x1={0.5}
											y1={2.18556e-8}
											x2={0.499999}
											y2={16}
											stroke="currentColor"
											strokeOpacity={0.32}
										/>
									</svg>
								</div>
							)}
							<div
								className="zn:!text-primary-icon-foreground  zn:inline-flex zn:items-center zn:!text-[13px]"
								onClick={resetAll}
							>
								<svg
									width={16}
									height={16}
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="zn:!me-1"
								>
									<mask
										id="mask0_2483_14352"
										style={{
											maskType: "alpha",
										}}
										maskUnits="userSpaceOnUse"
										x={0}
										y={0}
										width={16}
										height={16}
									>
										<rect width={16} height={16} fill="currentColor" />
									</mask>
									<g mask="url(#mask0_2483_14352)">
										<path
											d="M8 14C6.33333 14 4.91667 13.4167 3.75 12.25C2.58333 11.0833 2 9.66667 2 8C2 6.33333 2.58333 4.91667 3.75 3.75C4.91667 2.58333 6.33333 2 8 2C8.90278 2 9.73958 2.1875 10.5104 2.5625C11.2812 2.9375 11.9444 3.4375 12.5 4.0625V2.75C12.5 2.5375 12.5715 2.35937 12.7144 2.21562C12.8573 2.07187 13.0344 2 13.2456 2C13.4569 2 13.6354 2.07187 13.7812 2.21562C13.9271 2.35937 14 2.5375 14 2.75V6.25C14 6.4625 13.9281 6.64063 13.7844 6.78438C13.6406 6.92813 13.4625 7 13.25 7H9.75C9.5375 7 9.35938 6.92854 9.21562 6.78563C9.07187 6.64271 9 6.46563 9 6.25438C9 6.04313 9.07187 5.86458 9.21562 5.71875C9.35938 5.57292 9.5375 5.5 9.75 5.5H11.7292C11.3264 4.88889 10.7986 4.40278 10.1458 4.04167C9.49306 3.68056 8.77778 3.5 8 3.5C6.75 3.5 5.6875 3.9375 4.8125 4.8125C3.9375 5.6875 3.5 6.75 3.5 8C3.5 9.25 3.9375 10.3125 4.8125 11.1875C5.6875 12.0625 6.75 12.5 8 12.5C9.04167 12.5 9.95833 12.184 10.75 11.5521C11.5417 10.9201 12.0625 10.125 12.3125 9.16667C12.3681 8.97222 12.4826 8.81944 12.6562 8.70833C12.8299 8.59722 13.0141 8.55556 13.209 8.58333C13.4169 8.61111 13.5833 8.70486 13.7083 8.86458C13.8333 9.02431 13.875 9.20139 13.8333 9.39583C13.5139 10.7292 12.8194 11.8299 11.75 12.6979C10.6806 13.566 9.43056 14 8 14Z"
											fill="currentColor"
										/>
									</g>
								</svg>
								Reset
							</div>
						</div>
						{!svgSettings.hideLogo && (
							<span className="zn:md:!text-base zn:!text-sm zn:!text-primary-icon-foreground zn:flex zn:gap-2 zn:items-center">
								EaseAccess
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}
	return (
		<div
			className={cn(
				"zn:flex-none zn:flex   zn:gap-1   zn:justify-between zn:items-center zn:!py-3.5",
				{
					"zn:justify-end": !statementLinkData,
					"zn:!px-4": !isPopover,
				},
			)}
		>
			{statementLinkData && typeof statementLinkData === "object" && (
				<a
					key="accessibility-statement"
					href={statementLinkData.url}
					target="_blank"
					rel="noopener noreferrer"
					className="zn:!text-primary-icon-foreground zn:inline-flex zn:items-center zn:md:!text-sm zn:!text-xs"
				>
					{statementLinkData.text || "Accessibility Statement"}
					<Forward className="zn:ms-1 zn:size-3" />
				</a>
			)}
			{!svgSettings.hideLogo && (
				<span className="zn:md:!text-base zn:!text-xs zn:!text-primary-icon-foreground zn:flex zn:gap-2 zn:items-center">
					<FrontEndLogo className="zn:md:block zn:hidden" />
					<FrontEndLogo
						height={22}
						width={22}
						className="zn:md:hidden zn:block"
					/>
					EaseAccess
				</span>
			)}
		</div>
	);
}
