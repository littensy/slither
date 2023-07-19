import { SnakeEntity } from "./snake-slice";

interface SnakeDescription {
	readonly length: number;
	readonly radius: number;
	readonly spacingAtHead: number;
	readonly spacingAtTail: number;
	readonly turnSpeed: number;
}

export function snakeIsBoosting(snake: SnakeEntity) {
	return snake.boost && snake.score > 10;
}

export function describeSnakeFromScore(score: number): SnakeDescription {
	const radius = math.max(math.log10(score / 200 + 1), 0.5);

	return {
		radius,
		spacingAtHead: 1.5 * radius,
		spacingAtTail: 2.5 * radius,
		length: 36 * math.log10(score / 256 + 1) + 3,
		turnSpeed: math.rad(math.max(320 - 2 * score ** 0.5, 90)),
	};
}
