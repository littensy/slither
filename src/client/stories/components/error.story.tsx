import "client/app/react-config";

import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { ErrorHandler } from "client/components/error-handler";
import { RootProvider } from "client/providers/root-provider";

function BadComponent() {
	useEffect(() => {
		throw "Bad component!";
	}, []);

	return <frame />;
}

export = hoarcekat(() => (
	<RootProvider>
		<ErrorHandler key="error-handler">
			<BadComponent key="bad" />
		</ErrorHandler>
	</RootProvider>
));
