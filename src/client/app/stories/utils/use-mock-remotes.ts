import { useEffect } from "@rbxts/roact";
import { store } from "client/store";
import { LOCAL_USER } from "shared/constants";
import { remotes } from "shared/remotes";

export function useMockRemotes() {
	useEffect(() => {
		const connections = [
			remotes.snake.move.test.onFire((angle) => {
				store.setSnakeTargetAngle(LOCAL_USER, angle);
			}),

			remotes.snake.boost.test.onFire((boost) => {
				store.setSnakeBoost(LOCAL_USER, boost);
			}),

			remotes.snake.spawn.test.onFire(() => {
				store.addSnake(LOCAL_USER, "", Vector2.zero, "");
			}),
		];

		return () => {
			connections.forEach((connection) => connection());
		};
	}, []);
}
