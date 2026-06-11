import "../admin/style.css";
import { createRoot } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import WidgetApp from "./widget-wrapper";

// Configure apiFetch with the REST root URL so the bundled widget can talk
// to the WP REST API without the @wordpress/api-fetch global helpers.
const easeAccessRestUrl =
	(typeof window !== "undefined" &&
		window.EaseAccessLiteSettings?.rest_url) ||
	"";
if (easeAccessRestUrl) {
	apiFetch.use(apiFetch.createRootURLMiddleware(easeAccessRestUrl));
}

document.addEventListener("DOMContentLoaded", function () {
	const mountNode = document.createElement("div");
	mountNode.id = "accessibility-widget-parent";
	mountNode.setAttribute("data-easeaccess-ui", "widget-root");
	document.body.appendChild(mountNode);
	const root = createRoot(mountNode);
	root.render(<WidgetApp />);

	const navTarget = document.getElementById("accessibility-widget-nav");
	if (navTarget) {
		import(
			/* webpackChunkName: "frontend-nav-widget" */ "./nav-widget-wrapper"
		).then((module) => {
			const NavWidgetApp = module.default;
			const navRoot = createRoot(navTarget);
			navRoot.render(<NavWidgetApp />);
		});
	}
});
