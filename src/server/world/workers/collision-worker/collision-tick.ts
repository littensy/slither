import { store } from "server/store";
import { killSnake } from "server/world/utils/snake-utils";
import { selectSnakesSorted } from "shared/store/snakes";
import { isCollidingWithSnake, isCollidingWithWall } from "./collision-detection";

export function onCollisionTick() {
	// in a head-on collision, the snake with the lowest score is killed
	const snakes = store.getState(selectSnakesSorted((a, b) => a.score < b.score));

	for (const snake of snakes) {
		if (snake.dead) {
			continue;
		}

		if (isCollidingWithWall(snake) || isCollidingWithSnake(snake, snakes)) {
			killSnake(snake.id);
		}
	}
}
