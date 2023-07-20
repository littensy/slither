import { store } from "server/store";
import { selectCandiesById } from "shared/store/candy";
import { describeSnakeFromScore, selectSnakesById } from "shared/store/snakes";
import { eatCandy } from "./candy-helpers";

export function onCandyTick() {
	const snakes = store.getState(selectSnakesById);
	const candies = store.getState(selectCandiesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		const description = describeSnakeFromScore(snake.score);
		const range = description.radius * 1.2 + 0.5;

		for (const [, candy] of pairs(candies)) {
			if (candy.eatenAt) {
				continue;
			}

			const distance = candy.position.sub(snake.head).Magnitude;

			if (distance <= range) {
				eatCandy(candy.id, snake.id);
			}
		}
	}
}
