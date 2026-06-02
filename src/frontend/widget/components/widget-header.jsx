import { AppTooltip } from "@/components/tolltip-provider";
import { ForwardMedia } from "@/icons";
import { X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import HeaderShape from "./header-shape";
import FrontEndLogo from "./front-end-logo";
import FlagIcon from "@/components/FlagIcon";
import { useState, useEffect } from "@wordpress/element";
import { useMediaQuery } from "@wordpress/compose";
import { getActiveLanguage, LANGUAGE_STORAGE_KEY } from "@/lib/languages";

export default function WidgetHeader({
	resetAll,
	onClose,
	theme,
	onLanguageToggle,
}) {
	const { __ } = useTranslation();

	// Manage language state locally and listen for changes
	const [currentLanguage, setCurrentLanguage] = useState(() => {
		return getActiveLanguage();
	});

	// Listen for language change events
	useEffect(() => {
		const handleLanguageChange = (event) => {
			setCurrentLanguage(event.detail.language);
		};

		// Listen for custom language change event
		window.addEventListener("languageChanged", handleLanguageChange);

		// Also listen for storage changes (if changed in another tab)
		const handleStorageChange = (event) => {
			if (event.key === LANGUAGE_STORAGE_KEY) {
				setCurrentLanguage(getActiveLanguage());
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("languageChanged", handleLanguageChange);
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const languages = [
		{ code: "en_US", name: "English" },
		{ code: "zh_CN", name: "简体中文" },
		{ code: "es_ES", name: "Español" },
		{ code: "de_DE", name: "Deutsch" },
		{ code: "fr_FR", name: "Français" },
		{ code: "pt_PT", name: "Português" },
		{ code: "ru_RU", name: "Русский" },
		{ code: "ja_JP", name: "日本語" },
		{ code: "ko_KR", name: "한국어" },
		{ code: "ar_SA", name: "العربية" },
		{ code: "hi_IN", name: "हिन्दी" },
		{ code: "bn_BD", name: "বাংলা" },
		{ code: "ur_PK", name: "اردو" },
		{ code: "tr_TR", name: "Türkçe" },
		{ code: "nl_NL", name: "Nederlands" },
		{ code: "it_IT", name: "Italiano" },
		{ code: "pl_PL", name: "Polski" },
		{ code: "cs_CZ", name: "Čeština" },
		{ code: "hu_HU", name: "Magyar" },
		{ code: "uk_UA", name: "Українська" },
		{ code: "ro_RO", name: "Română" },
		{ code: "el_GR", name: "Ελληνικά" },
		{ code: "he_IL", name: "עברית" },
		{ code: "vi_VN", name: "Tiếng Việt" },
		{ code: "th_TH", name: "ไทย" },
		{ code: "ms_MY", name: "Bahasa Melayu" },
		{ code: "id_ID", name: "Bahasa Indonesia" },
		{ code: "sv_SE", name: "Svenska" },
		{ code: "nb_NO", name: "Norsk Bokmål" },
		{ code: "da_DK", name: "Dansk" },
		{ code: "fi_FI", name: "Suomi" },
		{ code: "fa_IR", name: "فارسی" },
	];

	const getCurrentLanguage = () => {
		return (
			languages.find((lang) => lang.code === currentLanguage) || languages[0]
		);
	};

	const selectedLanguage = getCurrentLanguage();
	const isMobile = useMediaQuery("(max-width: 768px)");
	if (theme === "default") {
		return (
			<div className="zn:!bg-[#F2F4F8] zn:!px-4 zn:flex zn:items-center zn:justify-between zn:md:min-h-[68px] zn:relative">
				<div
					className={cn("", {
						"zn:relative zn:!-ml-8": isMobile,
					})}
				>
					<span
						onClick={onLanguageToggle}
						className={cn(
							"zn:cursor-pointer zn:inline-flex zn:items-center zn:gap-2 zn:!px-2 zn:!py-1 zn:!bg-transparent zn:hover:!bg-black/10 zn:transition-all zn:duration-150 zn:rounded-md zn:text-default-800 zn:w-max",
							{
								"zn:relative zn:start-5.5": isMobile,
							},
						)}
					>
						<FlagIcon
							countryCode={selectedLanguage.code}
							className="zn:size-4"
						/>
						<span
							className={cn("zn:md:!text-sm  zn:!text-xs zn:font-medium ", {
								"zn:!text-primary-icon-foreground": theme === "classic",
								"zn:!text-default-800": theme === "default",
							})}
						>
							{selectedLanguage.code.split("_")[0].toUpperCase()}
						</span>
					</span>
				</div>
				<div className="zn:relative zn:-top-4 zn:z-0 zn:md:max-w-[330px] zn:max-w-[263px]">
					<HeaderShape />
					<div className="zn:absolute zn:top-0 zn:w-full zn:h-full zn:flex zn:!gap-2 zn:md:flex-col zn:flex-row zn:items-center zn:justify-center">
						<FrontEndLogo className="zn:md:size-7 zn:size-[33px]" />
						{!isMobile && (
							<span className="zn:md:!text-base zn:text-sm zn:!leading-none zn:font-semibold  zn:capitalize zn:!text-primary-icon-foreground">
								Accessibility
							</span>
						)}
					</div>
				</div>
				<div
					className={cn(" zn:relative zn:z-10   ", {
						"zn:grid zn:grid-cols-2 zn:!gap-1 zn:!-ml-5 ": !isMobile,
						"zn:!-ml-4": isMobile,
					})}
				>
					{!isMobile && (
						<AppTooltip
							title={
								<span
									onClick={resetAll}
									className="zn:cursor-pointer zn:inline-flex zn:items-center zn:justify-center zn:md:size-9 zn:!bg-transparent zn:md:hover:!bg-black/10 zn:transition-all zn:duration-150 zn:rounded-full zn:text-default-800"
								>
									<ForwardMedia className="zn:md:size-5 zn:size-4" />
								</span>
							}
							content={__("Reset All", "easeaccess")}
						/>
					)}
					<AppTooltip
						title={
							<span
								onClick={onClose}
								className="zn:cursor-pointer zn:inline-flex zn:items-center zn:justify-center zn:size-9 zn:!bg-transparent zn:hover:!bg-black/10 zn:transition-all zn:duration-150 zn:rounded-full zn:text-default-800"
							>
								<X className="zn:md:size-5 zn:size-4.5" />
							</span>
						}
						content={__("Close", "easeaccess")}
					/>
				</div>
			</div>
		);
	}
	return (
		<div className={cn("zn:flex zn:items-center zn:justify-between")}>
			<div className="zn:flex-1">
				<span
					onClick={onLanguageToggle}
					className="zn:cursor-pointer zn:md:inline-flex zn:hidden zn:items-center zn:gap-2 zn:!px-3 zn:!py-2 zn:text-sm zn:font-medium zn:text-white zn:bg-transparent zn:hover:!bg-white/10 zn:rounded-md zn:transition-all zn:duration-150"
				>
					<FlagIcon countryCode={selectedLanguage.code} className="zn:size-4" />
					<span className="zn:!text-primary-icon-foreground">
						{selectedLanguage.name} (
						{selectedLanguage.code.split("_")[0].toUpperCase()})
					</span>
				</span>
				<div className=" zn:md:hidden zn:flex zn:!gap-2  zn:items-center ">
					<FrontEndLogo />
					<span className="zn:md:text-base zn:text-sm zn:!leading-none zn:font-semibold  zn:capitalize zn:!text-primary-icon-foreground">
						Accessibility
					</span>
				</div>
			</div>
			<div className="zn:flex-none zn:flex zn:md:gap-1 zn:gap-2 zn:items-center">
				<span
					onClick={onLanguageToggle}
					className="zn:cursor-pointer zn:md:hidden zn:inline-flex zn:items-center zn:gap-2  zn:!text-sm zn:font-medium zn:text-white "
				>
					<FlagIcon countryCode={selectedLanguage.code} className="zn:size-4" />
					<span className="zn:!text-primary-icon-foreground">
						{selectedLanguage.code.split("_")[0].toUpperCase()}
					</span>
				</span>
				<AppTooltip
					title={
						<span onClick={resetAll} className="zn:cursor-pointer">
							<ForwardMedia className="zn:md:size-6 zn:size-4" />
						</span>
					}
					content={__("Reset All", "easeaccess")}
				/>
				<AppTooltip
					title={
						<span onClick={onClose} className="zn:cursor-pointer">
							<X className="zn:md:size-6 zn:size-4" />
						</span>
					}
					content={__("Close", "easeaccess")}
				/>
			</div>
		</div>
	);
}
