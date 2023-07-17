import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { SnakeController } from "client/app/components/snake-controller";
import { World } from "client/app/components/world/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_USER, WORLD_TICK } from "shared/constants";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { createScheduler } from "shared/utils/scheduler";
import { useMockRemotes } from "../utils/use-mock-remotes";

export = hoarcekat(() => {
	useMockRemotes();

	useEffect(() => {
		store.addSnake(LOCAL_USER, Players.LocalPlayer.DisplayName, new Vector2(), getRandomDefaultSnakeSkin().id);

		return createScheduler({
			interval: WORLD_TICK,
			onTick: store.updateSnakes,
		});
	}, []);

	return (
		<RootProvider>
			<World />
			<SnakeController />
		</RootProvider>
	);
});
