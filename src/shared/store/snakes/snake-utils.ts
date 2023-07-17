import { lerpStrict, mapStrict } from "shared/utils/math-utils";
import { SnakeEntity } from "./snake-slice";

export const SNAKE_SPEED = 6;
export const SNAKE_BOOST_SPEED = 10;

interface SnakeDescription {
	readonly segments: number;
	readonly radius: number;
	readonly spacingAtHead: number;
	readonly spacingAtTail: number;
	readonly turnSpeed: number;
}

export function snakeIsBoosting(snake: SnakeEntity) {
	return snake.boost && snake.score >= 50;
}

export function describeSnakeFromScore(score: number): SnakeDescription {
	return {
		segments: math.floor(lerpStrict(4, 50, score / 4000)),
		radius: mapStrict(score, 500, 8000, 0.5, 3),
		spacingAtHead: lerpStrict(0.75, 3, score / 8000),
		spacingAtTail: lerpStrict(0.75, 12, score / 8000),
		turnSpeed: lerpStrict(math.rad(270), math.rad(180), score / 8000),
	};
}

export function getSnakeScoreFromSegments(segments: number): number {
	return mapStrict(segments, 4, 50, 0, 4000);
}

export function getSnakePercentUntilNewSegment(score: number, segments: number): number {
	const nextScore = getSnakeScoreFromSegments(segments + 1);
	const prevScore = getSnakeScoreFromSegments(segments);
	return mapStrict(score, prevScore, nextScore, 0, 1);
}
