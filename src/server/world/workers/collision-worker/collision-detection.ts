import { getSnake } from "server/world/utils/world-utils";
import { WORLD_BOUNDS } from "shared/constants";
import { SnakeEntity, describeSnakeFromScore } from "shared/store/snakes";
import { snakeGrid } from "../snake-worker";

export function isCollidingWithWall(snake: SnakeEntity) {
	const radius = describeSnakeFromScore(snake.score).radius;
	return snake.head.Magnitude + radius > WORLD_BOUNDS;
}

export function isCollidingWithSnake(snake: SnakeEntity) {
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

	return distance <= 0.9 * (radius + enemyRadius);
}
