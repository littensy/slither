import { lerp } from "@rbxts/pretty-react-hooks";
import { createProducer } from "@rbxts/reflex";
import { map, turnRadians } from "shared/utils/math-utils";
import { mapObject } from "shared/utils/object-utils";
import {
	SNAKE_BOOST_SPEED,
	SNAKE_SPEED,
	describeSnakeFromScore,
	getSnakePercentUntilNewSegment,
	snakeIsBoosting,
} from "./snake-utils";

export interface SnakesState {
	readonly [id: string]: SnakeEntity | undefined;
}

export interface SnakeEntity {
	readonly id: string;
	readonly name: string;
	readonly head: Vector2;
	readonly angle: number;
	readonly targetAngle: number;
	readonly score: number;
	readonly boost: boolean;
	readonly segments: readonly Vector2[];
	readonly skin: string;
	readonly dead: boolean;
}

const initialState: SnakesState = {};

const initialSnake: SnakeEntity = {
	id: "",
	name: "",
	head: new Vector2(),
	angle: 0,
	targetAngle: 0,
	score: 0,
	boost: false,
	segments: [],
	skin: "",
	dead: false,
};

export const snakesSlice = createProducer(initialState, {
	addSnake: (state, id: string, name: string, head: Vector2, skin: string) => ({
		...state,
		[id]: { ...initialSnake, id, name, head, skin },
	}),

	removeSnake: (state, id: string) => ({
		...state,
		[id]: undefined,
	}),

	updateSnakes: (state, deltaTime: number) => {
		return mapObject(state, (snake) => {
			if (snake.dead) {
				return snake;
			}

			const {
				turnSpeed,
				segments: targetSegmentCount,
				spacingAtHead,
				spacingAtTail,
			} = describeSnakeFromScore(snake.score);

			const speed = snakeIsBoosting(snake) ? SNAKE_BOOST_SPEED : SNAKE_SPEED;

			const newAngle = turnRadians(snake.angle, snake.targetAngle, turnSpeed * deltaTime);
			const newHead = snake.head.add(new Vector2(math.cos(newAngle), math.sin(newAngle)).mul(speed * deltaTime));

			const currentSegmentCount = snake.segments.size();
			const newSegments: Vector2[] = [];
			let lastSegment = newHead;

			snake.segments.forEach((segment, index) => {
				if (index >= targetSegmentCount) {
					return;
				}

				// as the index approaches the end of the snake, the segments should
				// be further apart
				const spacing = map(index, 0, currentSegmentCount, spacingAtHead, spacingAtTail);

				// make sure the interpolation doesn't overshoot the previous segment
				let alpha = math.clamp(1 - math.exp((-speed * deltaTime) / spacing), 0, 1);

				// the tail should be closer to the next segment based on how close it
				// is to generating a new segment
				if (index === currentSegmentCount - 1) {
					const percent = getSnakePercentUntilNewSegment(snake.score, currentSegmentCount);
					alpha = lerp(alpha, 1, 1 - percent);
				}

				lastSegment = segment.Lerp(lastSegment, alpha);
				newSegments.push(lastSegment);
			});

			if (currentSegmentCount < targetSegmentCount) {
				const tail = newSegments[newSegments.size() - 1] || newHead;

				for (const _ of $range(currentSegmentCount, targetSegmentCount)) {
					newSegments.push(tail);
				}
			}

			return { ...snake, head: newHead, angle: newAngle, segments: newSegments };
		});
	},

	setSnakeTargetAngle: (state, id: string, targetAngle: number) => {
		return mapObject(state, (snake) => {
			return snake.id === id ? { ...snake, targetAngle } : snake;
		});
	},

	setSnakeBoost: (state, id: string, boost: boolean) => {
		return mapObject(state, (snake) => {
			return snake.id === id ? { ...snake, boost } : snake;
		});
	},

	setSnakeDead: (state, id: string) => {
		return mapObject(state, (snake) => {
			return snake.id === id ? { ...snake, dead: true } : snake;
		});
	},

	patchSnake: (state, id: string, intersection: Partial<SnakeEntity>) => {
		return mapObject(state, (snake) => {
			return snake.id === id ? { ...snake, ...intersection } : snake;
		});
	},

	incrementSnakeScore: (state, id: string, amount: number) => {
		return mapObject(state, (snake) => {
			return snake.id === id ? { ...snake, score: math.max(snake.score + amount, 0) } : snake;
		});
	},
});
