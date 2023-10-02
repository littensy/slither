import { hoarcekat, useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Alerts } from "client/app/components/alerts";
import { Menu } from "client/app/components/menu";
import { World } from "client/app/components/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_USER } from "shared/constants";
import { defaultPlayerSave } from "shared/store/saves";

import { useMockRemotes } from "../utils/use-mock-remotes";

export = hoarcekat(() => {
	useMockRemotes();

	useMountEffect(() => {
		store.setMenuPage("skins");
		store.setPlayerSave(LOCAL_USER, defaultPlayerSave);
	});

	return (
		<RootProvider>
			<World />
			<Menu />
			<Alerts />
		</RootProvider>
	);
});
