import { createProducer } from "@rbxts/reflex";
import { lerpRadians } from "shared/utils/math-utils";
import { mapObject } from "shared/utils/object-utils";
import { SNAKE_BOOST_SPEED, SNAKE_SPEED, describeSnakeFromScore } from "./snake-utils";

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
		[id]: { id, name, head, angle: 0, targetAngle: 0, score: 0, boost: false, segments: new Array(4, head) },
	}),

	removeSnake: (state, id: string) => ({
		...state,
		[id]: undefined,
	}),

	updateSnakes: (state, deltaTime: number) => {
		return mapObject(state, (snake) => {
			const {
				turnSpeed,
				segments: targetSegmentCount,
				spacing,
				interpolation,
			} = describeSnakeFromScore(snake.score);

			const angle = lerpRadians(snake.angle, snake.targetAngle, turnSpeed * deltaTime);
			const speed = snake.boost ? SNAKE_BOOST_SPEED : SNAKE_SPEED;
			const head = snake.head.add(new Vector2(math.cos(angle), math.sin(angle)).mul(speed * deltaTime));

			const segments = snake.segments.mapFiltered((segment, index) => {
				if (index >= targetSegmentCount) {
					return;
				}

				const previous = snake.segments[index - 1] || snake.head;

				// interpolate towards the previous segment
				segment = segment.Lerp(previous, (deltaTime * speed) / interpolation);

				// constrain the segment to the segment spacing
				if (segment.sub(previous).Magnitude > spacing) {
					segment = previous.add(segment.sub(previous).Unit.mul(spacing));
				}

				return segment;
			});

			const currentSegmentCount = snake.segments.size();

			if (currentSegmentCount < targetSegmentCount) {
				// grow the snake by adding segments to the tail
				const tail = segments[segments.size() - 1] || head;

				for (const _ of $range(currentSegmentCount, targetSegmentCount)) {
					segments.push(tail);
				}
			}

			return { ...snake, head, angle, segments };
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
