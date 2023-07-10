import { createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { App } from "./components/app";
import { RootProvider } from "./providers/root-provider";

const root = createRoot(Players.LocalPlayer.WaitForChild("PlayerGui"));

root.render(
	<StrictMode>
		<RootProvider>
			<App />
		</RootProvider>
	</StrictMode>,
);
