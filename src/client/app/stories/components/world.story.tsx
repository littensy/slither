import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { World } from "client/app/components/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { SNAKE_STEP_TIME } from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";

const ids = [Players.LocalPlayer.Name, ...new Array(10, 0).map((_, index) => `${index}`)];

export = hoarcekat(() => {
	useEffect(() => {
		for (const id of ids) {
			store.addSnake(id, id, new Vector2(math.random(0, 20), math.random(0, 20)));
			store.incrementSnakeScore(id, 3000);
		}
	}, []);

	useEffect(() => {
		return createScheduler({
			interval: SNAKE_STEP_TIME,
			onStep: store.updateSnakes,
		});
	}, []);

	useInterval(
		() => {
			for (const id of ids) {
				store.setSnakeTargetAngle(id, math.random() * 2 * math.pi);
			}
		},
		1.5,
		{ immediate: true },
	);

	useInterval(
		() => {
			store.setWorldFocus(ids[math.random(0, ids.size() - 1)]);
		},
		4,
		{ immediate: true },
	);

	return (
		<RootProvider>
			<World />
		</RootProvider>
	);
});
