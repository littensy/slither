import "client/app/react-config";

import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
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
		<ErrorHandler>
			<BadComponent />
		</ErrorHandler>
	</RootProvider>
));
