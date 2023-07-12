import { useEffect } from "@rbxts/roact";
import { store } from "client/store";
import { LOCAL_ID } from "shared/constants";
import { remotes } from "shared/remotes";

export function useMockRemotes() {
	useEffect(() => {
		const connections = [
			remotes.snake.move.test.onFire((angle) => {
				store.setSnakeTargetAngle(LOCAL_ID, angle);
			}),

			remotes.snake.boost.test.onFire((boost) => {
				store.setSnakeBoost(LOCAL_ID, boost);
			}),
		];

		return () => {
			connections.forEach((connection) => connection());
		};
	}, []);
}
