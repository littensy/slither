import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Controller } from "client/app/components/controller";
import { World } from "client/app/components/world/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_USER, WORLD_TICK } from "shared/constants";
import { getRandomAccent } from "shared/data/palette";
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
				head: new Vector2(math.random(-10, 10), math.random(-10, 10)),
				skin: getRandomDefaultSnakeSkin().id,
				score: math.random(0, 8000),
			});
		}

		store.populateCandy(
			fillArray(50, (index) => ({
				id: `${index}`,
				position: new Vector2(math.random(-50, 50), math.random(-25, 25)),
				size: math.random(1, 50),
				color: getRandomAccent(),
				type: "default",
			})),
		);

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
			<Controller />
		</RootProvider>
	);
});
