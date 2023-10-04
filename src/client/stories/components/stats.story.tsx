import "client/app/react-config";

import { hoarcekat, useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Menu } from "client/components/menu";
import { Stats } from "client/components/stats";
import { Backdrop } from "client/components/world/backdrop";
import { RootProvider } from "client/providers/root-provider";
import { store } from "client/store";
import { USER_NAME } from "shared/constants/core";
import { defaultPlayerSave } from "shared/store/saves";

export = hoarcekat(() => {
	useMountEffect(() => {
		store.setPlayerSave(USER_NAME, {
			...defaultPlayerSave,
			balance: 1000,
		});
	});

	return (
		<RootProvider>
			<Backdrop key="backdrop" />
			<Menu key="menu" />
			<Stats key="stats" />
		</RootProvider>
	);
});
