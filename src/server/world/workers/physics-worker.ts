import { store } from "server/store";
import { WORLD_BOUNDS, WORLD_STEP_TIME } from "shared/constants";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { selectSnakeById, selectSnakesById } from "shared/store/snakes";
import { getSafePointInWorld } from "../utils";

export function connectPhysicsWorker() {
	const disconnectSpawn = remotes.snake.spawn.connect((player) => {
		if (playerIsSpawned(player)) {
			return;
		}

		store.addSnake(player.Name, player.DisplayName, getSafePointInWorld(), getRandomDefaultSnakeSkin().id);
	});

	const disconnectMove = remotes.snake.move.connect((player, angle) => {
		store.setSnakeTargetAngle(player.Name, angle);
	});

	const disconnectBoost = remotes.snake.boost.connect((player, boost) => {
		store.setSnakeBoost(player.Name, boost);
	});

	return () => {
		disconnectSpawn();
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

function playerIsSpawned(player: Player) {
	return store.getState(selectSnakeById(player.Name)) !== undefined;
}
