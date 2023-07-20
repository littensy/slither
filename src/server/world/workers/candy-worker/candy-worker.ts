import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getSnake } from "server/world/utils/world-utils";
import { CANDY_LIMITS } from "shared/constants";
import { getSnakeTracerSkin } from "shared/data/skins";
import { selectCandyCount } from "shared/store/candy";
import {
	describeSnakeFromScore,
	identifySnake,
	selectAliveSnakesById,
	selectSnakeIsBoosting,
} from "shared/store/snakes";
import { createCandy, populateCandy, removeCandyIfAtLimit } from "./candy-helpers";

const random = new Random();

export function connectCandyWorker() {
	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	const controlPopulation = store.subscribe(
		selectCandyCount("default"),
		(count) => count < CANDY_LIMITS.default,
		(count) => populateCandy(CANDY_LIMITS.default - count),
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

	populateCandy(CANDY_LIMITS.default);

	return () => {
		controlPopulation();
		snakeObserver();
	};
}

function dropCandyWhileBoosting(id: string) {
	return store.observeWhile(selectSnakeIsBoosting(id), () => {
		let previousTail = Vector2.zero;

		const dropCandy = () => {
			const snake = getSnake(id);

			if (!snake) {
				return;
			}

			const description = describeSnakeFromScore(snake.score);
			const tail = snake.tracers[snake.tracers.size() - 1];

			if (tail.sub(previousTail).Magnitude < description.radius * 2) {
				return;
			}

			previousTail = tail;

			const candy = createCandy({
				size: random.NextInteger(1, 5),
				position: tail,
				type: "dropping",
			});

			removeCandyIfAtLimit("dropping");

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
			type: "loot",
		});
	});

	removeCandyIfAtLimit("loot");

	store.populateCandy(candies);
}
