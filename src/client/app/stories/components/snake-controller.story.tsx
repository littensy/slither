import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { SnakeController } from "client/app/components/snake-controller";
import { World } from "client/app/components/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_ID } from "shared/constants";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { SNAKE_STEP_TIME } from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";

export = hoarcekat(() => {
	useEffect(() => {
		store.addSnake(LOCAL_ID, Players.LocalPlayer.DisplayName, new Vector2(), getRandomDefaultSnakeSkin().id);

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

	return (
		<RootProvider>
			<World />
			<SnakeController />
		</RootProvider>
	);
});
