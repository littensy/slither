import { createProducer } from "@rbxts/reflex";
import { Dictionary } from "@rbxts/sift";
import { lerpRadians } from "shared/utils/math-utils";
import {
	SNAKE_BOOST_SPEED,
	SNAKE_SPEED,
	SNAKE_STEP_TIME,
	getSegmentCount,
	getSegmentSpacing,
	getSnakeTurnSpeed,
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
}

const initialState: SnakesState = {};

export const snakesSlice = createProducer(initialState, {
	addSnake: (state, id: string, name: string, head: Vector2) => ({
		...state,
		[id]: {
			id,
			name,
			head,
			angle: 0,
			targetAngle: 0,
			score: 0,
			boost: false,
			segments: new Array(getSegmentCount(0), head),
		},
	}),

	removeSnake: (state, id: string) => ({
		...state,
		[id]: undefined,
	}),

	updateSnakes: (state) => {
		return Dictionary.map(state, (snake) => {
			if (!snake) {
				return;
			}

			const turnSpeed = getSnakeTurnSpeed(snake.score);
			const angle = lerpRadians(snake.angle, snake.targetAngle, turnSpeed * SNAKE_STEP_TIME);

			const speed = snake.boost ? SNAKE_BOOST_SPEED : SNAKE_SPEED;
			const head = snake.head.add(new Vector2(math.cos(angle), math.sin(angle)).mul(speed * SNAKE_STEP_TIME));

			const currentSegmentCount = snake.segments.size();
			const targetSegmentCount = getSegmentCount(snake.score);
			const segmentSpacing = getSegmentSpacing(snake.score);

			const segments = snake.segments.mapFiltered((segment, index) => {
				if (index >= targetSegmentCount) {
					return;
				}

				const previous = snake.segments[index - 1] || head;
				const distance = segment.sub(previous).Magnitude;

				if (distance <= segmentSpacing) {
					return segment;
				}

				const direction = distance > 0 ? segment.sub(previous).Unit : Vector2.zero;

				return previous.add(direction.mul(segmentSpacing));
			});

			if (currentSegmentCount < targetSegmentCount) {
				const tail = segments[segments.size() - 1] || head;

				for (const _ of $range(currentSegmentCount, targetSegmentCount)) {
					segments.push(tail);
				}
			}

			return {
				...snake,
				head,
				angle,
				segments,
			};
		});
	},

	setSnakeTargetAngle: (state, id: string, targetAngle: number) => {
		const snake = state[id];

		if (!snake) {
			return state;
		}

		return {
			...state,
			[id]: { ...snake, targetAngle },
		};
	},

	updateSnake: (state, id: string, intersection: Partial<SnakeEntity>) => {
		const snake = state[id];

		if (!snake) {
			return state;
		}

		return {
			...state,
			[id]: { ...snake, ...intersection },
		};
	},

	incrementSnakeScore: (state, id: string, amount: number) => {
		const snake = state[id];

		if (!snake) {
			return state;
		}

		return {
			...state,
			[id]: { ...snake, score: snake.score + amount },
		};
	},
});
