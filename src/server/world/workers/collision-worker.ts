import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { describeSnakeFromScore, selectSnakesById } from "shared/store/snakes";

interface Node {
	readonly segment: Vector2;
	readonly head: Vector2;
	readonly radius: number;
}

export function connectCollisionWorker() {
	// todo: try using a quadtree to speed up collision detection
	return () => {};
}

export function handleCollisionUpdate() {
	const snakes = store.getState(selectSnakesById);
	const nodes: Node[] = [];

	// construct a new set of all snake nodes
	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		const { radius } = describeSnakeFromScore(snake.score);

		for (const segment of snake.segments) {
			nodes.push({ segment, head: snake.head, radius });
		}
	}

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		const { radius } = describeSnakeFromScore(snake.score);
		const didCollide = checkCollisions(nodes, snake.head, radius);

		if (didCollide) {
			store.setSnakeDead(snake.id);

			setTimeout(() => {
				store.removeSnake(snake.id);
			}, 1);
		}
	}
}

function checkCollisions(nodes: Node[], head: Vector2, radius: number) {
	for (const node of nodes) {
		if (node.head === head) {
			continue;
		}

		const distance = node.segment.sub(head).Magnitude;

		if (distance <= radius + node.radius) {
			return true;
		}
	}

	return false;
}
