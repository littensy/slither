import { lerpStrict } from "shared/utils/math-utils";

export const SNAKE_SPEED = 6;
export const SNAKE_BOOST_SPEED = 10;

interface SnakeDescription {
	readonly segments: number;
	readonly radius: number;
	readonly spacingAtHead: number;
	readonly spacingAtTail: number;
	readonly turnSpeed: number;
}

export function describeSnakeFromScore(score: number): SnakeDescription {
	return {
		segments: lerpStrict(3, 40, score / 6000),
		radius: lerpStrict(0.5, 3, score / 8000),
		spacingAtHead: lerpStrict(0.5, 3, score / 8000),
		spacingAtTail: lerpStrict(0.5, 12, score / 8000),
		turnSpeed: lerpStrict(math.rad(150), math.rad(45), score / 8000),
	};
}
