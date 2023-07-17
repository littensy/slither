import { store } from "server/store";
import { WORLD_BOUNDS, WORLD_TICK } from "shared/constants";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { selectSnakeById, selectSnakesById } from "shared/store/snakes";
import { getSafePointInWorld, killSnake } from "../utils";

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

	const disconnectKill = remotes.snake.kill.connect((player) => {
		killSnake(player.Name);
	});

	return () => {
		disconnectSpawn();
		disconnectMove();
		disconnectBoost();
		disconnectKill();
	};
}

export function onPhysicsTick() {
	store.updateSnakes(WORLD_TICK);
	killSnakesOutOfBounds();
}

function killSnakesOutOfBounds() {
	const snakes = store.getState(selectSnakesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		if (snake.head.Magnitude > WORLD_BOUNDS) {
			killSnake(snake.id);
		}
	}
}

function playerIsSpawned(player: Player) {
	return store.getState(selectSnakeById(player.Name)) !== undefined;
}
