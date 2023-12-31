import { store } from "server/store";
import { getSnake, killSnake } from "server/world/utils";
import { WORLD_BOUNDS } from "shared/constants/core";
import { describeSnakeFromScore, selectSnakesSorted, SnakeEntity } from "shared/store/snakes";

import { snakeGrid } from "../snakes";

export function onCollisionTick() {
	// in a head-on collision, the snake with the lowest score is killed
	const snakes = store.getState(selectSnakesSorted((a, b) => a.score < b.score));

	for (const snake of snakes) {
		if (snake.dead) {
			continue;
		}

		if (isCollidingWithWall(snake)) {
			killSnake(snake.id);
			continue;
		}

		const enemy = isCollidingWithSnake(snake);

		if (enemy) {
			killSnake(snake.id);
			store.playerKilledSnake(enemy.id, snake.id);
			store.incrementSnakeEliminations(enemy.id);
		}
	}
}

function isCollidingWithWall(snake: SnakeEntity) {
	const radius = describeSnakeFromScore(snake.score).radius;
	return snake.head.Magnitude + radius > WORLD_BOUNDS;
}

function isCollidingWithSnake(snake: SnakeEntity) {
	const radius = describeSnakeFromScore(snake.score).radius;

	const nearest = snakeGrid.nearest(snake.head, radius + 5, (data) => {
		const enemy = getSnake(data.metadata.id);
		return enemy !== undefined && !enemy.dead && enemy.id !== snake.id;
	});

	const enemy = nearest && getSnake(nearest.metadata.id);

	if (!enemy) {
		return;
	}

	const enemyRadius = describeSnakeFromScore(enemy.score).radius;
	const distance = nearest.position.sub(snake.head).Magnitude;

	if (distance <= 0.8 * (radius + enemyRadius)) {
		return enemy;
	}
}
