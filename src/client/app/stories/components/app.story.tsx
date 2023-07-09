import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { App } from "client/app/components/app";
import { RootProvider } from "client/app/providers/root-provider";

export = hoarcekat(() => (
	<RootProvider>
		<App />
	</RootProvider>
));
