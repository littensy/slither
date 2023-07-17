import { store } from "server/store";
import { SnakeEntity, describeSnakeFromScore, selectSnakeById, selectSnakesSorted } from "shared/store/snakes";
import { killSnake } from "../utils";

export function onCollisionTick() {
	// in a head-on collision, the snake with the lowest score is killed
	const snakes = store.getState(selectSnakesSorted((a, b) => a.score < b.score));

	for (const snake of snakes) {
		if (snake.dead) {
			continue;
		}

		if (checkCollisions(snake, snakes)) {
			killSnake(snake.id);
		}
	}
}

function checkCollisions(snake: SnakeEntity, snakes: SnakeEntity[]) {
	const { radius } = describeSnakeFromScore(snake.score);

	for (const enemyStale of snakes) {
		// treat the enemy state as 'stale' just in case a previous
		// snake killed this one in the same tick
		const enemy = store.getState(selectSnakeById(enemyStale.id));

		if (!enemy || snake === enemy || enemy.dead) {
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
