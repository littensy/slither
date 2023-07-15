import { store } from "server/store";
import { WORLD_BOUNDS, WORLD_STEP_TIME } from "shared/constants";
import { remotes } from "shared/remotes";
import { selectSnakesById } from "shared/store/snakes";

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

export function onPhysicsStep() {
	store.updateSnakes(WORLD_STEP_TIME);
	killSnakesOutOfBounds();
}

function killSnakesOutOfBounds() {
	const snakes = store.getState(selectSnakesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		if (snake.head.Magnitude > WORLD_BOUNDS) {
			store.setSnakeDead(snake.id);
		}
	}
}
