import { lerpStrict } from "shared/utils/math-utils";

export const SNAKE_SPEED = 6;
export const SNAKE_BOOST_SPEED = 10;
export const SNAKE_STEP_TIME = 1 / 16;

interface SnakeDescription {
	readonly segments: number;
	readonly radius: number;
	readonly spacing: number;
	readonly interpolation: number;
	readonly turnSpeed: number;
}

export function describeSnakeFromScore(score: number): SnakeDescription {
	return {
		segments: lerpStrict(3, 50, score / 2000),
		radius: lerpStrict(0.5, 2, score / 3000),
		spacing: lerpStrict(0.25, 2, score / 3000),
		interpolation: lerpStrict(1, 4, score / 3000),
		turnSpeed: lerpStrict(math.rad(150), math.rad(45), score / 3000),
	};
}
