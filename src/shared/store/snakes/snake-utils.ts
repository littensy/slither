import { lerpStrict } from "shared/utils/math-utils";

export const SNAKE_SPEED = 6;
export const SNAKE_BOOST_SPEED = 10;
export const SNAKE_STEP_TIME = 1 / 30;

export function getSegmentCount(score: number) {
	return lerpStrict(5, 50, score / 1000);
}

export function getSegmentRadius(score: number) {
	return lerpStrict(0.5, 2, score / 3000);
}

export function getSegmentSpacing(score: number) {
	return lerpStrict(0.3, 1.5, score / 3000);
}

export function getSnakeTurnSpeed(score: number) {
	return lerpStrict(math.rad(270), math.rad(120), score / 3000);
}
