import { store } from "server/store";
import { WORLD_STEP_TIME } from "shared/constants";
import { remotes } from "shared/remotes";

export function connectPhysicsWorker() {
	const disconnectMove = remotes.snake.move.connect((player, angle) => {
		store.setSnakeTargetAngle(player.Name, angle);
	});

	const disconnectBoost = remotes.snake.boost.connect((player, boost) => {
		store.setSnakeBoost(player.Name, boost);
	});

	return () => {
		disconnectMove();
		disconnectBoost();
	};
}

export function handlePhyicsUpdate() {
	store.updateSnakes(WORLD_STEP_TIME);
}
