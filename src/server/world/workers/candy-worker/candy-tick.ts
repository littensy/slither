import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { selectCandyById, selectStaticCandiesById } from "shared/store/candy";
import { SnakeEntity, describeSnakeFromScore, selectSnakesById } from "shared/store/snakes";

export function onCandyTick() {
	const snakes = store.getState(selectSnakesById);
	const candies = store.getState(selectStaticCandiesById);

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
				eatCandy(snake, candy.id);
			}
		}
	}
}

function eatCandy(snake: SnakeEntity, id: string) {
	const candy = store.getState(selectCandyById(id));

	if (!candy || candy.eatenAt) {
		return;
	}

	store.setCandyEatenAt(candy.id, snake.head);
	store.incrementSnakeScore(snake.id, candy.size);

	setTimeout(() => {
		store.removeCandy(candy.id);
	}, 0.5);
}
