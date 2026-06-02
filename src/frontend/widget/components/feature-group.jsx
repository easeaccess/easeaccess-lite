import { featureConfig } from "@/hooks/use-feayure-toggle";
import { stepBasedFeatures } from "@/lib/step-based-features";
import { isRenderableComponent } from "@/lib/react-component";
import { CircleCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { AnimatedContainer } from "@/motions/animated-container";
import { AnimatedItem } from "@/motions/animated-item";
import PointerTrailColorPicker from "./pointer-trail-color-picker";
import BigCursorVariantPicker from "./big-cursor-variant-picker";

export default function FeatureGroup({
	title,
	settings,
	isActive,
	handleToggle,
	getFeatureStep,
	buttonHandler,
	onPageStructure,
	onDictionaryToggle,
	theme,
}) {
	const { __ } = useTranslation();
	return (
		<AnimatedContainer className="">
			<AnimatedItem
				className={cn(
					" zn:font-medium zn:md:!mb-5 zn:!mb-4 zn:text-default-800 zn:!text-start ",
					{
						"zn:md:!text-lg zn:!text-base zn:md:!mt-8 zn:!mt-6  zn:!leading-none":
							theme === "default",
						"zn:md:!mt-10 zn:!mt-6 zn:!text-base zn:!leading-none":
							theme === "classic",
					},
				)}
				delay={0.3}
			>
				{__(title, "easeaccess")}
			</AnimatedItem>
			<div
				className={cn("zn:grid   zn:md:gap-4 zn:gap-2", {
					"zn:md:grid-cols-2 zn:grid-cols-1": theme === "default",
					"zn:lg:grid-cols-3 zn:md:grid-cols-2 zn:grid-cols-1":
						theme !== "default",
				})}
			>
				{settings.map((setting, indexOfSetting) => {
					const IconComponent = isRenderableComponent(setting.icon)
						? setting.icon
						: Settings;

					const active = isActive(setting.key);
					const config = stepBasedFeatures[setting.key];
					const totalSteps = config?.steps ?? 0;
					const mode = config?.mode ?? "click";
					const labels = config?.labels ?? [];
					const icons = config?.icons ?? [];
					const currentStep = getFeatureStep(setting.key);
					const currentLabel = labels[currentStep] ?? "";
					const StepIcon = icons[currentStep] || IconComponent;
					const StepLabel = currentLabel || setting.label;

					const handleClick = () => {
						if (mode === "click") {
							if (setting.key === "pageStructure") {
								const pageData = featureConfig.pageStructure.handler((data) => {
									onPageStructure(data);
								});
							} else if (setting.key === "dictionary") {
								onDictionaryToggle(setting.key);
							} else {
								handleToggle(setting.key);
							}
						}
					};

					return (
						<AnimatedItem
							key={setting.key}
							// Set delay based on the length of the setting key
							delay={indexOfSetting * 0.05}
						>
							<div
								onClick={handleClick}
								className={cn(
									"zn:!border zn:relative  zn:!text-gray-900 zn:text-center  zn:!px-4 zn:!border-default-100 zn:hover:!border-primary-icon zn:!rounded-md zn:!bg-white   zn:transition zn:cursor-pointer zn:flex   zn:flex-col",
									{
										"zn:!text-primary-icon zn:!border-primary-icon": active,
										"zn:justify-center zn:items-center zn:!py-5":
											theme === "classic",
										"zn:!py-[23px]": theme === "default",
									},
								)}
							>
								{active && (
									<span className="zn:absolute zn:right-1 zn:top-3">
										<CircleCheck className="zn:!text-primary-icon zn:size-5 zn:!fill-primary-icon zn:!stroke-primary-foreground" />
									</span>
								)}
								{theme === "default" ? (
									<div className="zn:flex zn:gap-3 zn:items-center">
										<StepIcon className="zn:w-6 zn:h-6 zn:flex-none" />
										<div
											className={cn(
												"zn:font-medium zn:!text-[15px] zn:flex-1 zn:break-words zn:text-start ",
												{
													"zn:text-primary-icon": active,
												},
											)}
										>
											<span>{__(StepLabel, "easeaccess")}</span>
										</div>
									</div>
								) : (
									<div className="zn:flex zn:items-center zn:justify-center zn:flex-col">
										<StepIcon className="zn:w-7 zn:h-7 zn:!mb-3" />
										<div>
											<div
												className={cn(
													"zn:font-medium zn:!text-sm zn:whitespace-nowrap",
													{ "zn:text-primary-icon": active },
												)}
											>
												<span>{__(StepLabel, "easeaccess")}</span>
											</div>
										</div>
									</div>
								)}
								{typeof totalSteps === "number" &&
									mode === "click" &&
									currentStep >= 0 && (
										<div className="zn:!mt-2 zn:flex zn:gap-1 zn:justify-center zn:items-center zn:w-full">
											{[...Array(totalSteps)].map((_, idx) => (
												<div
													key={idx}
													className={cn(
														"zn:h-1 zn:grow zn:w-full zn:rounded-full",
														{
															"zn:!bg-primary-icon": idx <= currentStep,
															"zn:!bg-primary-icon/20": idx > currentStep,
														},
													)}
												></div>
											))}
										</div>
									)}
								{mode === "buttons" && (
									<div className="zn:mt-2 zn:flex zn:justify-center zn:gap-2">
										<button onClick={() => buttonHandler(setting.key, "dec")}>
											−
										</button>
										<button onClick={() => buttonHandler(setting.key, "inc")}>
											+
										</button>
									</div>
								)}
								{setting.key === "pointerTrail" && active && (
									<PointerTrailColorPicker />
								)}
								{setting.key === "bigCursor" && active && (
									<BigCursorVariantPicker />
								)}
							</div>
						</AnimatedItem>
					);
				})}
			</div>
		</AnimatedContainer>
	);
}
