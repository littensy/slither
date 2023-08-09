import { store } from "server/store";
import { getCandy } from "server/world/utils";
import { describeSnakeFromScore, selectSnakesById } from "shared/store/snakes";
import { candyGrid, eatCandy } from "./candy-helpers";

export function onCandyTick() {
	const snakes = store.getState(selectSnakesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		const range = describeSnakeFromScore(snake.score).radius * 1.2 + 0.5;

		const nearest = candyGrid.nearest(snake.head, range, (point) => {
			const candy = getCandy(point.metadata.id);
			return candy !== undefined && !candy.eatenAt;
		});

		if (nearest) {
			eatCandy(nearest.metadata.id, snake.id);
		}
	}
}
