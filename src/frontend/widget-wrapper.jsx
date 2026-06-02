import WidgetContextProvider from "../context/widget-context-provider";
import LightweightWidgetShell from "./widget/lightweight-widget-shell";
import { AnimationProvider } from "@/context/animation-provider";

const WidgetApp = () => {
	return (
		<WidgetContextProvider>
			<AnimationProvider>
				<LightweightWidgetShell />
			</AnimationProvider>
		</WidgetContextProvider>
	);
};

export default WidgetApp;
