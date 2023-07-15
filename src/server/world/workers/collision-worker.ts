import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { SnakeEntity, SnakesState, describeSnakeFromScore, selectSnakesById } from "shared/store/snakes";

export function onCollisionStep() {
	const snakes = store.getState(selectSnakesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		if (checkCollisions(snake, snakes)) {
			store.setSnakeDead(snake.id);

			setTimeout(() => {
				store.removeSnake(snake.id);
			}, 1);
		}
	}
}

function checkCollisions(snake: SnakeEntity, snakes: SnakesState) {
	const { radius } = describeSnakeFromScore(snake.score);

	for (const [, enemy] of pairs(snakes)) {
		if (snake === enemy || enemy.dead) {
			continue;
		}

		const { radius: enemyRadius } = describeSnakeFromScore(enemy.score);

		for (const segment of enemy.segments) {
			const distance = segment.sub(snake.head).Magnitude;

			if (distance <= radius + enemyRadius) {
				return true;
			}
		}
	}

	return false;
}
