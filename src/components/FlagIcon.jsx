const FlagIcon = ({ countryCode, className = "zn:w-4 zn:h-4" }) => {
	// Map language codes to country codes for flags
	const getFlagCode = (langCode) => {
		const flagMap = {
			en_US: "us",
			zh_CN: "cn",
			es_ES: "es",
			de_DE: "de",
			fr_FR: "fr",
			pt_PT: "pt",
			ru_RU: "ru",
			ja_JP: "jp",
			ko_KR: "kr",
			ar_SA: "sa",
			hi_IN: "in",
			bn_BD: "bd",
			ur_PK: "pk",
			tr_TR: "tr",
			nl_NL: "nl",
			it_IT: "it",
			pl_PL: "pl",
			cs_CZ: "cz",
			hu_HU: "hu",
			uk_UA: "ua",
			ro_RO: "ro",
			el_GR: "gr",
			he_IL: "il",
			vi_VN: "vn",
			th_TH: "th",
			ms_MY: "my",
			id_ID: "id",
			sv_SE: "se",
			nb_NO: "no",
			da_DK: "dk",
			fi_FI: "fi",
			fa_IR: "ir",
		};
		return flagMap[langCode] || "us";
	};

	const flagCode = getFlagCode(countryCode);

	return (
		<img
			src={`https://flagcdn.com/w20/${flagCode}.png`}
			srcSet={`https://flagcdn.com/w40/${flagCode}.png 2x`}
			width="28"
			height="21"
			alt={`${countryCode} flag`}
			className={className}
			onError={(e) => {
				// Fallback to a generic flag icon if image fails to load
				e.target.style.display = "none";
				e.target.nextSibling.style.display = "inline-block";
			}}
		/>
	);
};

export default FlagIcon;
