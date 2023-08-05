import { createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { App } from "./components/app";
import { RootProvider } from "./providers/root-provider";
import { profileAllComponents } from "./utils/profiler";

const target = Players.LocalPlayer.WaitForChild("PlayerGui");
const root = createRoot(target, { hydrate: true });

profileAllComponents();

root.render(
	<StrictMode>
		<RootProvider>
			<App />
		</RootProvider>
	</StrictMode>,
);
