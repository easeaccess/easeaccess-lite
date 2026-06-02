import WidgetContextProvider from "../context/widget-context-provider";
import LicenseContextProvider from "../context/license-context-provider";
import NavApp from "./widget/nav-app";
import { AnimationProvider } from "@/context/animation-provider";

const NavWidgetApp = () => {
	return (
		<LicenseContextProvider>
			<WidgetContextProvider>
				<AnimationProvider>
					<NavApp />
				</AnimationProvider>
			</WidgetContextProvider>
		</LicenseContextProvider>
	);
};

export default NavWidgetApp;
