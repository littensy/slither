import { hoarcekat, useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Menu } from "client/app/components/menu";
import { Stats } from "client/app/components/stats";
import { Backdrop } from "client/app/components/world/backdrop";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_USER } from "shared/constants";
import { defaultPlayerSave } from "shared/store/saves";

export = hoarcekat(() => {
	useMountEffect(() => {
		store.setPlayerSave(LOCAL_USER, {
			...defaultPlayerSave,
			balance: 1000,
		});
	});

	return (
		<RootProvider>
			<Backdrop />
			<Menu />
			<Stats />
		</RootProvider>
	);
});
