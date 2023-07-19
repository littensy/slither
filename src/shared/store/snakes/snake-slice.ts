import { createProducer } from "@rbxts/reflex";
import { SNAKE_BOOST_SPEED, SNAKE_SPEED, WORLD_TICK } from "shared/constants";
import { map, turnRadians } from "shared/utils/math-utils";
import { mapObject } from "shared/utils/object-utils";
import { describeSnakeFromScore, snakeIsBoosting } from "./snake-utils";

export interface SnakesState {
	readonly [id: string]: SnakeEntity | undefined;
}

export interface SnakeEntity {
	readonly id: string;
	readonly name: string;
	readonly head: Vector2;
	readonly angle: number;
	readonly desiredAngle: number;
	readonly score: number;
	readonly boost: boolean;
	readonly tracers: readonly Vector2[];
	readonly skin: string;
	readonly dead: boolean;
}

const initialState: SnakesState = {};

const initialSnake: SnakeEntity = {
	id: "",
	name: "",
	head: new Vector2(),
	angle: 0,
	desiredAngle: 0,
	score: 10,
	boost: false,
	tracers: [],
	skin: "",
	dead: false,
};

export const snakesSlice = createProducer(initialState, {
	addSnake: (state, id: string, patch?: Partial<SnakeEntity>) => ({
		...state,
		[id]: { ...initialSnake, id, name: id, ...patch },
	}),

	removeSnake: (state, id: string) => ({
		...state,
		[id]: undefined,
	}),

	snakeTick: (state, deltaTime: number = WORLD_TICK) => {
		return mapObject(state, (snake) => {
			if (snake.dead) {
				return snake;
			}

			const description = describeSnakeFromScore(snake.score);

			const speed = snakeIsBoosting(snake) ? SNAKE_BOOST_SPEED : SNAKE_SPEED;
			const angle = turnRadians(snake.angle, snake.desiredAngle, description.turnSpeed * deltaTime);
			const direction = new Vector2(math.cos(angle), math.sin(angle));
			const head = snake.head.add(direction.mul(speed * deltaTime));

			const currentLength = snake.tracers.size();
			const desiredLength = math.floor(description.length);
			let tail = head;

			const tracers = snake.tracers.mapFiltered((tracer, index) => {
				if (index >= desiredLength) {
					return;
				}

				const previous = snake.tracers[index - 1] || head;

				// spacing should be longer near the end of the snake to allow longer
				// snakes but with less tracers
				const spacing = map(index, 0, currentLength, description.spacingAtHead, description.spacingAtTail);

				// the alpha of the interpolation that will decide the space between
				// the current tracer and the previous tracer
				const alpha = math.clamp((deltaTime * speed) / spacing, 0, 1);

				if (index === desiredLength - 1) {
					// the tail's spacing from the previous tracer should be proportional
					// to the score needed to reach the next length
					tail = tail.Lerp(tracer.Lerp(previous, alpha), description.length % 1);
				} else {
					tail = tracer.Lerp(previous, alpha);
				}

				return tail;
			});

			if (currentLength < desiredLength) {
				for (const _ of $range(currentLength, desiredLength)) {
					tracers.push(tail);
				}
			}

			return { ...snake, head, angle, tracers };
		});
	},

	turnSnake: (state, id: string, desiredAngle: number) => {
		return mapObject(state, (snake) => {
			return snake.id === id ? { ...snake, desiredAngle } : snake;
		});
	},

	boostSnake: (state, id: string, boost: boolean) => {
		return mapObject(state, (snake) => {
			return snake.id === id ? { ...snake, boost } : snake;
		});
	},

	setSnakeIsDead: (state, id: string) => {
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
