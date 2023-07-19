import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getSnake } from "server/world/utils/snake-utils";
import { WORLD_MAX_CANDY } from "shared/constants";
import { getSnakeTracerSkin } from "shared/data/skins";
import { selectSpawnedCandyCount } from "shared/store/candy";
import { identifySnake, selectAliveSnakesById, selectSnakeIsBoosting } from "shared/store/snakes";
import { fillArray } from "shared/utils/object-utils";
import { createCandy } from "./create-candy";

const random = new Random();

export function connectCandyWorker() {
	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	const controlPopulation = store.subscribe(
		selectSpawnedCandyCount,
		(count) => count < WORLD_MAX_CANDY,
		(count) => populateCandy(WORLD_MAX_CANDY - count),
	);

	const snakeObserver = store.observe(selectAliveSnakesById, identifySnake, ({ id }) => {
		// while boosting, decrement the snake's score and create candy
		// on the snake's tail
		const disconnect = dropCandyWhileBoosting(id);

		// when the snake dies, create candy on the snake's tracers
		return () => {
			disconnect();
			createCandyOnSnake(id);
		};
	});

	populateCandy(WORLD_MAX_CANDY);

	return () => {
		controlPopulation();
		snakeObserver();
	};
}

function populateCandy(amount: number) {
	store.populateCandy(fillArray(amount, () => createCandy()));
}

function dropCandyWhileBoosting(id: string) {
	return store.observeWhile(selectSnakeIsBoosting(id), () => {
		let previousTail = Vector2.zero;

		const dropCandy = () => {
			const snake = getSnake(id)!;
			const tail = snake.tracers[snake.tracers.size() - 1];

			if (tail.sub(previousTail).Magnitude < 1) {
				return;
			}

			previousTail = tail;

			const candy = createCandy({
				size: random.NextInteger(1, 5),
				position: tail,
				fromSnake: true,
			});

			store.addCandy(candy);
		};

		return setInterval(() => {
			store.incrementSnakeScore(id, random.NextInteger(-5, -3));
			dropCandy();
		}, 0.2);
	});
}

function createCandyOnSnake(id: string): void {
	const snake = getSnake(id);

	if (!snake) {
		return;
	}

	const candies = snake.tracers.map((tracer, index) => {
		const skin = getSnakeTracerSkin(snake.skin, index);

		return createCandy({
			size: random.NextInteger(5, 20),
			position: tracer,
			color: skin.tint,
			fromSnake: true,
		});
	});

	store.populateCandy(candies);
}
