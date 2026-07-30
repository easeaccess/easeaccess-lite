// Country flags are bundled locally (SVG sourced from the MIT-licensed
// flag-icons project) and served from the plugin's own /build directory.
// No remote requests and no reliance on the OS/WordPress emoji system.
import us from "@/images/flags/us.svg";
import cn from "@/images/flags/cn.svg";
import es from "@/images/flags/es.svg";
import de from "@/images/flags/de.svg";
import fr from "@/images/flags/fr.svg";
import pt from "@/images/flags/pt.svg";
import ru from "@/images/flags/ru.svg";
import jp from "@/images/flags/jp.svg";
import kr from "@/images/flags/kr.svg";
import sa from "@/images/flags/sa.svg";
import inFlag from "@/images/flags/in.svg";
import bd from "@/images/flags/bd.svg";
import pk from "@/images/flags/pk.svg";
import tr from "@/images/flags/tr.svg";
import nl from "@/images/flags/nl.svg";
import it from "@/images/flags/it.svg";
import pl from "@/images/flags/pl.svg";
import cz from "@/images/flags/cz.svg";
import hu from "@/images/flags/hu.svg";
import ua from "@/images/flags/ua.svg";
import ro from "@/images/flags/ro.svg";
import gr from "@/images/flags/gr.svg";
import il from "@/images/flags/il.svg";
import vn from "@/images/flags/vn.svg";
import th from "@/images/flags/th.svg";
import my from "@/images/flags/my.svg";
import id from "@/images/flags/id.svg";
import se from "@/images/flags/se.svg";
import no from "@/images/flags/no.svg";
import dk from "@/images/flags/dk.svg";
import fi from "@/images/flags/fi.svg";
import ir from "@/images/flags/ir.svg";

// Map language codes to their flag image.
const FLAG_SRC = {
	en_US: us,
	zh_CN: cn,
	es_ES: es,
	de_DE: de,
	fr_FR: fr,
	pt_PT: pt,
	ru_RU: ru,
	ja_JP: jp,
	ko_KR: kr,
	ar_SA: sa,
	hi_IN: inFlag,
	bn_BD: bd,
	ur_PK: pk,
	tr_TR: tr,
	nl_NL: nl,
	it_IT: it,
	pl_PL: pl,
	cs_CZ: cz,
	hu_HU: hu,
	uk_UA: ua,
	ro_RO: ro,
	el_GR: gr,
	he_IL: il,
	vi_VN: vn,
	th_TH: th,
	ms_MY: my,
	id_ID: id,
	sv_SE: se,
	nb_NO: no,
	da_DK: dk,
	fi_FI: fi,
	fa_IR: ir,
};

const FlagIcon = ({ countryCode, className = "zn:w-4 zn:h-4" }) => {
	const src = FLAG_SRC[countryCode] || us;

	return (
		<img
			src={src}
			width="20"
			height="15"
			alt={`${countryCode} flag`}
			className={className}
			loading="lazy"
			decoding="async"
		/>
	);
};

export default FlagIcon;
