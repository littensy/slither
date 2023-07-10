import { hoarcekat, useInterval, useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { World } from "client/app/components/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { SNAKE_STEP_TIME } from "shared/store/snakes";

const ids = [Players.LocalPlayer.Name, ...new Array(10, 0).map((_, index) => `${index}`)];

export = hoarcekat(() => {
	useMountEffect(() => {
		for (const id of ids) {
			store.addSnake(id, id, new Vector2(math.random(0, 20), math.random(0, 20)));
			store.incrementSnakeScore(id, math.random(0, 500));
		}
	});

	useInterval(() => {
		store.updateSnakes();
	}, SNAKE_STEP_TIME);

	useInterval(
		() => {
			for (const id of ids) {
				store.setSnakeTargetAngle(id, math.random() * 2 * math.pi);
			}
		},
		1.5,
		{ immediate: true },
	);

	return (
		<RootProvider>
			<World />
		</RootProvider>
	);
});
