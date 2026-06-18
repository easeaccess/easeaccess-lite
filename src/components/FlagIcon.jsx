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

	// Render the country as a small 2-letter code badge. Fully self-contained:
	// no remote image requests, no bundled flag assets, and no reliance on the
	// OS/WordPress emoji system (which would otherwise fetch flag glyphs from
	// s.w.org on platforms lacking native flag emoji).
	return (
		<span
			className={className}
			role="img"
			aria-label={`${countryCode} flag`}
			style={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				minWidth: "1.4em",
				padding: "0.1em 0.25em",
				fontSize: "0.7em",
				fontWeight: 700,
				lineHeight: 1,
				letterSpacing: "0.5px",
				textTransform: "uppercase",
				borderRadius: "3px",
				background: "#e5e7eb",
				color: "#374151",
			}}
		>
			{flagCode}
		</span>
	);
};

export default FlagIcon;
