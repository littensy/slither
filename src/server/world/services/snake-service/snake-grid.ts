import { store } from "server/store";
import { selectSnakesById } from "shared/store/snakes";
import { createGrid } from "shared/utils/grid";

export const snakeGrid = createGrid<{ id: string }>(10);

export function updateSnakeGrid() {
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
