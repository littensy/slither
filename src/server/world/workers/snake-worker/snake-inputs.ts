import { store } from "server/store";
import { getSafePointInWorld } from "server/world/utils/spawn-utils";
import { killSnake, playerIsSpawned } from "server/world/utils/world-utils";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";

export const nextSnakeInputs = new Map<string, number>();

export function connectSnakeInputs() {
	const spawnHandle = remotes.snake.spawn.connect((player) => {
		if (playerIsSpawned(player)) {
			return;
		}

		store.addSnake(player.Name, {
			name: player.DisplayName,
			head: getSafePointInWorld(),
			skin: getRandomDefaultSnakeSkin().id,
			score: 10,
		});
	});

	const moveHandle = remotes.snake.move.connect((player, angle) => {
		nextSnakeInputs.set(player.Name, angle);
	});

	const boostHandle = remotes.snake.boost.connect((player, boost) => {
		store.boostSnake(player.Name, boost);
	});

	const killHandle = remotes.snake.kill.connect((player) => {
		killSnake(player.Name);
	});

	return () => {
		spawnHandle();
		moveHandle();
		boostHandle();
		killHandle();
	};
}

export function consumeNextSnakeInputs() {
	for (const [id, angle] of nextSnakeInputs) {
		store.turnSnake(id, angle);
	}

	nextSnakeInputs.clear();
}
