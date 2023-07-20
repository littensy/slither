import { store } from "server/store";
import { describeSnakeFromScore, selectSnakesById } from "shared/store/snakes";
import { candyGrid, eatCandy } from "./candy-helpers";

export function onCandyTick() {
	const snakes = store.getState(selectSnakesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		const description = describeSnakeFromScore(snake.score);
		const range = description.radius * 1.2 + 0.5;
		const nearest = candyGrid.nearest(snake.head, range);

		if (nearest) {
			eatCandy(nearest.metadata.id, snake.id);
		}
	}
}
