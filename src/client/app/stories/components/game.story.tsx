import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Game } from "client/app/components/game";
import { SnakeController } from "client/app/components/snake-controller";
import { World } from "client/app/components/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_USER, WORLD_BOUNDS, WORLD_TICK } from "shared/constants";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { fillArray } from "shared/utils/object-utils";
import { createScheduler } from "shared/utils/scheduler";
import { useMockRemotes } from "../utils/use-mock-remotes";

const IDS = [LOCAL_USER, ...fillArray(10, (index) => `${index}`)];

export = hoarcekat(() => {
	useMockRemotes();

	useEffect(() => {
		for (const id of IDS) {
			store.addSnake(id, {
				name: id,
				head: new Vector2(math.random(-WORLD_BOUNDS, WORLD_BOUNDS), math.random(-WORLD_BOUNDS, WORLD_BOUNDS)),
				skin: getRandomDefaultSnakeSkin().id,
				score: math.random(0, 5000),
			});
		}

		return createScheduler({
			name: "world-tick",
			interval: WORLD_TICK,
			onTick: store.snakeTick,
		});
	}, []);

	useInterval(() => {
		for (const id of IDS) {
			if (id !== LOCAL_USER) {
				store.turnSnake(id, math.random() * 2 * math.pi);
			}
		}
	}, 1.5);

	return (
		<RootProvider>
			<World />
			<Game />
			<SnakeController />
		</RootProvider>
	);
});
