import { useState, useEffect, useRef } from "@wordpress/element";
import { ArrowLeft, CircleCheck, Languages, Search } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import FlagIcon from "./FlagIcon";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useTranslation } from "@/hooks/use-translation";
// Lite: page translation is a Pro feature. We only switch widget UI strings.
import {
	LANGUAGES,
	getActiveLanguage,
	persistUserLanguage,
	dispatchLanguageChanged,
} from "@/lib/languages";

const LanguageSwitcher = ({ isOpen, onBack }) => {
	const { __ } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState(() =>
		getActiveLanguage(),
	);
	const [searchTerm, setSearchTerm] = useState("");
	const searchInputRef = useRef(null);

	useEffect(() => {
		if (
			window.wp &&
			window.wp.i18n &&
			typeof window.wp.i18n.setLocale === "function"
		) {
			window.wp.i18n.setLocale(currentLanguage);
		}
	}, [currentLanguage]);

	const handleSelect = (languageCode) => {
		setCurrentLanguage(languageCode);
		setSearchTerm("");
		persistUserLanguage(languageCode);
		dispatchLanguageChanged(languageCode);
		if (onBack) onBack();
	};

	const filteredLanguages = LANGUAGES.filter(
		(lang) =>
			lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			lang.code.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			setTimeout(() => {
				searchInputRef.current.focus();
			}, 100);
		} else if (!isOpen) {
			setSearchTerm("");
		}
	}, [isOpen]);

	const selectedLanguage =
		LANGUAGES.find((lang) => lang.code === currentLanguage) || LANGUAGES[0];

	if (!isOpen) return null;

	return (
		<div className="zn:!text-primary-icon-foreground zn:!p-4">
			<div className="zn:flex zn:items-center zn:justify-between">
				<span
					onClick={onBack}
					className="zn:flex zn:items-center zn:gap-2 zn:cursor-pointer"
				>
					<ArrowLeft className="zn:size-5" />
					<span>{__("Back", "easeaccess")}</span>
				</span>
			</div>

			<div className="zn:text-center zn:!mb-6">
				<div className="zn:font-semibold zn:md:!text-xl zn:!text-base zn:md:!mb-2 zn:!mb-0.5">
					{__("Language Selection", "easeaccess")}
				</div>
				<div className="zn:font-normal zn:md:!text-sm zn:!text-xs">
					{__("Choose your preferred interface language", "easeaccess")}
				</div>
			</div>

			<div className="zn:!mb-4 zn:!p-3 zn:!bg-gray-50 zn:rounded-lg zn:flex zn:items-center zn:gap-3">
				<Badge variant="outline" className="zn:!flex zn:items-center zn:gap-2">
					<Languages className="zn:size-4" />
					{__("Current", "easeaccess")}
				</Badge>
				<FlagIcon
					countryCode={selectedLanguage.code}
					className="zn:w-5 zn:h-4"
				/>
				<span className="zn:font-medium zn:flex-1 zn:min-w-0 zn:truncate">
					{selectedLanguage.name}
				</span>
			</div>

			<div className="zn:!bg-gray-50 zn:rounded-[20px] zn:!p-4">
				<div className="zn:!mb-4">
					<div className="zn:relative">
						<Search className="zn:absolute zn:left-3 zn:top-1/2 zn:transform zn:-translate-y-1/2 zn:size-4 zn:text-default-400" />
						<Input
							ref={searchInputRef}
							type="text"
							placeholder={__("Search languages...", "easeaccess")}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="zn:w-full zn:!pl-10 zn:!pr-4 zn:!py-3 zn:text-sm zn:!border zn:!border-default-200 zn:rounded-lg zn:!bg-white zn:outline-none zn:focus:!border-primary focus:zn:!ring-0"
						/>
					</div>
				</div>

				<div className="zn:!mt-4">
					<ScrollArea className="zn:h-[400px]">
						{filteredLanguages.length > 0 ? (
							<div className="zn:space-y-2">
								{filteredLanguages.map((lang) => (
									<div
										key={lang.code}
										onClick={() => handleSelect(lang.code)}
										className={cn(
											"zn:!py-3 zn:!px-4 zn:group zn:!flex zn:!gap-3 zn:!bg-white zn:rounded-md zn:hover:!bg-gray-100 zn:transition zn:cursor-pointer zn:!text-sm zn:!items-center",
											{
												"zn:!bg-primary-icon zn:!text-white zn:hover:!bg-primary-icon/90":
													currentLanguage === lang.code,
											},
										)}
									>
										<FlagIcon
											countryCode={lang.code}
											className="zn:w-5 zn:h-4 zn:flex-none"
										/>
										<span
											className={cn(
												"zn:flex-1 zn:font-medium zn:text-default-800",
												{
													"zn:!text-white": currentLanguage === lang.code,
												},
											)}
										>
											{lang.name}
										</span>
										{currentLanguage === lang.code && (
											<CircleCheck className="zn:size-5 zn:flex-none" />
										)}
									</div>
								))}
							</div>
						) : (
							<div className="zn:text-center zn:!py-8 zn:!text-gray-500">
								{__("No languages found", "easeaccess")}
							</div>
						)}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
};

export default LanguageSwitcher;
