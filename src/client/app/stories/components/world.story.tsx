import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { SnakeController } from "client/app/components/snake-controller";
import { World } from "client/app/components/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_ID } from "shared/constants";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { SNAKE_STEP_TIME } from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";

const IDS = [LOCAL_ID, ...new Array(10, 0).map((_, index) => `${index}`)];

export = hoarcekat(() => {
	useEffect(() => {
		for (const id of IDS) {
			store.addSnake(id, id, new Vector2(math.random(0, 20), math.random(0, 20)), getRandomDefaultSnakeSkin().id);
			store.incrementSnakeScore(id, math.random(0, 2000));
		}

		return createScheduler({
			interval: SNAKE_STEP_TIME,
			onStep: store.updateSnakes,
		});
	}, []);

	useEffect(() => {
		return remotes.snake.move.test.onFire((angle) => {
			store.setSnakeTargetAngle(LOCAL_ID, angle);
		});
	}, []);

	useInterval(() => {
		for (const id of IDS) {
			if (id !== LOCAL_ID) {
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
