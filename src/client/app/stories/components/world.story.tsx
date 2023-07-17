import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { SnakeController } from "client/app/components/snake-controller";
import { World } from "client/app/components/world/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_USER, WORLD_TICK } from "shared/constants";
import { getRandomAccent } from "shared/data/palette";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { createScheduler } from "shared/utils/scheduler";
import { useMockRemotes } from "../utils/use-mock-remotes";

const IDS = [LOCAL_USER, ...new Array(10, 0).map((_, index) => `${index}`)];

export = hoarcekat(() => {
	useMockRemotes();

	useEffect(() => {
		for (const id of IDS) {
			store.addSnake(
				id,
				id,
				new Vector2(math.random(-10, 10), math.random(-10, 10)),
				getRandomDefaultSnakeSkin().id,
			);
			store.incrementSnakeScore(id, math.random(0, 8000));
		}

		store.populateCandy(
			new Array(50, 0).map((_, index) => ({
				id: `${index}`,
				position: new Vector2(math.random(-50, 50), math.random(-25, 25)),
				size: math.random(1, 50),
				color: getRandomAccent(),
				type: "static",
			})),
		);

		return createScheduler({
			interval: WORLD_TICK,
			onTick: store.updateSnakes,
		});
	}, []);

	useInterval(() => {
		for (const id of IDS) {
			if (id !== LOCAL_USER) {
				store.setSnakeTargetAngle(id, math.random() * 2 * math.pi);
			}
		}
	}, 1.5);

	return (
		<RootProvider>
			<World />
			<SnakeController />
		</RootProvider>
	);
});
