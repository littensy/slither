import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { ErrorHandler } from "client/app/components/error-handler";
import { RootProvider } from "client/app/providers/root-provider";

function BadComponent() {
	useEffect(() => {
		throw "Bad component!";
	}, []);

	return <frame />;
}

export = hoarcekat(() => (
	<RootProvider>
		<ErrorHandler>
			<BadComponent key="bad" />
		</ErrorHandler>
	</RootProvider>
));
