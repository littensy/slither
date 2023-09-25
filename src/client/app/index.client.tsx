import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { IS_CANARY } from "shared/constants";

import { App } from "./app";
import { RootProvider } from "./providers/root-provider";
import { profileAllComponents } from "./utils/profiler";

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

if (IS_CANARY) {
	profileAllComponents();
	debug.setmemorycategory("App");
}

root.render(
	createPortal(
		<StrictMode>
			<RootProvider>
				<App />
			</RootProvider>
		</StrictMode>,
		target,
	),
);
