import { createRoot } from "@rbxts/react-roblox";
import Roact, { Portal, StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { App } from "./components/app";
import { RootProvider } from "./providers/root-provider";

const root = createRoot(new Instance("Folder"));
const target = Players.LocalPlayer.WaitForChild("PlayerGui");

root.render(
	<StrictMode>
		<RootProvider>
			<Portal target={target}>
				<App />
			</Portal>
		</RootProvider>
	</StrictMode>,
);
