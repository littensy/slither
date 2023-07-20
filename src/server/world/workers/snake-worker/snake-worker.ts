import { Players } from "@rbxts/services";
import { store } from "server/store";
import { killSnake } from "server/world/utils/world-utils";
import { selectSnakesById } from "shared/store/snakes";
import { snakeGrid } from "./snake-grid";
import { connectSnakeInputs, consumeNextSnakeInputs, nextSnakeInputs } from "./snake-inputs";

export function connectSnakeWorker() {
	const playerRemoving = Players.PlayerRemoving.Connect((player) => {
		nextSnakeInputs.delete(player.Name);
		killSnake(player.Name);
	});

	const inputHandle = connectSnakeInputs();

	return () => {
		playerRemoving.Disconnect();
		inputHandle();
	};
}

export function onSnakeTick() {
	consumeNextSnakeInputs();
	store.snakeTick();
	updateSnakeGrid();
}

function updateSnakeGrid() {
	const snakes = store.getState(selectSnakesById);

	snakeGrid.clear();

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		snakeGrid.insert(snake.head, { id: snake.id });

		for (const tracer of snake.tracers) {
			snakeGrid.insert(tracer, { id: snake.id });
		}
	}
}
