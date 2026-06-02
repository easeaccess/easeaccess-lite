// admin/index.js
import { render } from "@wordpress/element";

import { AccessiblyProvider } from "../context/accessibly-provider";
import LicenseContextProvider from "../context/license-context-provider";
import { AppProvider } from "./app-provider";
import { AnimationProvider } from "@/context/animation-provider";

const App = () => {
	return (
		<AccessiblyProvider>
			<LicenseContextProvider>
				<AnimationProvider>
					<AppProvider />
				</AnimationProvider>
			</LicenseContextProvider>
		</AccessiblyProvider>
	);
};

document.addEventListener("DOMContentLoaded", () => {
	const root = document.getElementById("zone7-accessibility");
	if (root) {
		// Mark the entire admin React tree as EaseAccess UI so the scanner can
		// reliably exclude it via [data-easeaccess-ui] ancestor lookup.
		root.setAttribute("data-easeaccess-ui", "admin-root");
		render(<App />, root);
	}
});
