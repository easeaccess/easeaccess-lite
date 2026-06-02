import { useContext } from "@wordpress/element";
import "./style.css";
import "./custom.css";
import { Toaster } from "../components/ui/sonner";
import { tabs } from "../constant/data";
import General from "./pages/general";
import Customization from "./pages/customization";
import Featurespage from "./pages/features";
import { usePersistentTab } from "../hooks/use-persistent-tab";
import Header from "../admin/components/header";
import Sidebar from "../admin/components/sidebar";
import { Button } from "../components/ui/button";
import AccessiblyContext from "../context/accessibly-context";
import StatementPage from "./pages/statement";
import { AnimatedContainer } from "@/motions/animated-container";

export const AppProvider = () => {
	const [activeTab, changeTab] = usePersistentTab(
		"zone7-active-tab",
		tabs,
		"general",
	);

	const { saveSettings, isSaving, hasChanges } = useContext(AccessiblyContext);

	return (
		<div className="zn:font-sans zn:!min-h-screen zn:!bg-gray-50">
			<Toaster richColors />
			<Header {...{ activeTab, changeTab }} />
			<div className="zn:flex zn:gap-0">
				<Sidebar activeTab={activeTab} changeTab={changeTab} />
				<AnimatedContainer className="zn:flex-1 zn:!min-w-0 zn:!px-6 zn:!py-8">
					{activeTab === "general" && <General />}
					{activeTab === "customization" && <Customization />}
					{activeTab === "features" && <Featurespage />}
					{activeTab === "statement" && <StatementPage />}
					{activeTab !== "statement" && (
						<Button
							onClick={saveSettings}
							disabled={isSaving || !hasChanges}
							className="zn:flex zn:items-center zn:gap-2 zn:mt-6"
							variant={"default"}
						>
							{isSaving ? <> Saving...</> : <> Save Settings</>}
						</Button>
					)}
				</AnimatedContainer>
			</div>
		</div>
	);
};
