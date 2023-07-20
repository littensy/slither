import { getSnake } from "server/world/utils/world-utils";
import { WORLD_BOUNDS } from "shared/constants";
import { SnakeEntity, describeSnakeFromScore } from "shared/store/snakes";

export function isCollidingWithWall(snake: SnakeEntity) {
	return snake.head.Magnitude > WORLD_BOUNDS;
}

export function isCollidingWithSnake(snake: SnakeEntity, snakes: SnakeEntity[]) {
	const { radius } = describeSnakeFromScore(snake.score);

	const check = (tracer: Vector2, tracerRadius: number) => {
		const distance = tracer.sub(snake.head).Magnitude;

		if (distance <= 0.9 * (radius + tracerRadius)) {
			return true;
		}
	};

	for (const enemyStale of snakes) {
		// treat the enemy state as 'stale' just in case a previous
		// snake killed this one in the same tick
		const enemy = getSnake(enemyStale.id);

		if (!enemy || snake === enemy || enemy.dead) {
			continue;
		}

		const { radius: enemyRadius } = describeSnakeFromScore(enemy.score);

		if (check(enemy.head, enemyRadius)) {
			return true;
		}

		for (const tracer of enemy.tracers) {
			if (check(tracer, enemyRadius)) {
				return true;
			}
		}
	}

	return false;
}
