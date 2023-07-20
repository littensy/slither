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
	const radius = math.max(1 * math.log10(score / 512 + 1.5) + 0.3, 0.5);

	return {
		radius,
		spacingAtHead: radius,
		spacingAtTail: 2.5 * radius,
		length: 48 * math.log10(score / 256 + 1) + 3,
		turnSpeed: math.rad(math.max(270 - 96 * math.log10(score / 512 + 1), 45)),
	};
}
