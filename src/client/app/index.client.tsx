import "../dev";

import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RootProvider } from "client/providers/root-provider";
import { profileAllComponents } from "client/utils/profiler";
import { IS_CANARY } from "shared/constants/core";

import { App } from "./app";

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

if (IS_CANARY) {
	profileAllComponents();
	debug.setmemorycategory("App");
}

root.render(
	createPortal(
		<StrictMode>
			<RootProvider key="root-provider">
				<App key="app" />
			</RootProvider>
		</StrictMode>,
		target,
	),
);
