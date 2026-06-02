import WidgetContext from "./widget-context";
import useWidget from "../hooks/use-widget";

export default function WidgetContextProvider({ children }) {
	const settings = useWidget();

	return (
		<WidgetContext.Provider value={settings}>{children}</WidgetContext.Provider>
	);
}
