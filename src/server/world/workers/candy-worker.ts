import { setInterval, setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { WORLD_MAX_CANDY } from "shared/constants";
import { getRandomAccent } from "shared/data/palette";
import { getSnakeSegmentSkin } from "shared/data/skins";
import { CandyEntity, selectCandyById, selectStaticCandiesById, selectStaticCandyCount } from "shared/store/candy";
import {
	SnakeEntity,
	describeSnakeFromScore,
	identifySnake,
	selectAliveSnakesById,
	selectSnakeById,
	selectSnakeIsBoosting,
	selectSnakesById,
} from "shared/store/snakes";
import { fillArray } from "shared/utils/object-utils";
import { getRandomPointNearWorldOrigin } from "../utils";

const random = new Random();
let nextCandyId = 0;

export function connectCandyWorker() {
	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	const controlPopulation = store.subscribe(
		selectStaticCandyCount,
		(count) => count < WORLD_MAX_CANDY,
		(count) => populateCandy(WORLD_MAX_CANDY - count),
	);

	// while boosting, decrement the snake's score and create candy
	// on the snake's tail
	const snakeObserver = store.observe(selectAliveSnakesById, identifySnake, ({ id }) => {
		const boostObserver = store.observeWhile(selectSnakeIsBoosting(id), () => {
			const update = () => {
				const snake = store.getState(selectSnakeById(id))!;
				const tail = snake.segments[snake.segments.size() - 1];

				store.incrementSnakeScore(id, -25);
				store.addCandy(createCandy(random.NextInteger(5, 15), tail));
			};

			update();

			return setInterval(update, 0.2);
		});

		return () => {
			boostObserver();
			createCandyOnSnake(id);
		};
	});

	populateCandy(WORLD_MAX_CANDY);

	return () => {
		controlPopulation();
		snakeObserver();
	};
}

export function onCandyTick() {
	const snakes = store.getState(selectSnakesById);
	const candies = store.getState(selectStaticCandiesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		const description = describeSnakeFromScore(snake.score);
		const range = description.radius * 1.5 + 1;

		for (const [, candy] of pairs(candies)) {
			if (candy.eatenAt) {
				continue;
			}

			const distance = candy.position.sub(snake.head).Magnitude;

			if (distance <= range) {
				eatCandy(snake, candy.id);
			}
		}
	}
}

export function createCandy(
	size = random.NextInteger(1, 20),
	position = getRandomPointNearWorldOrigin(0.9),
	color = getRandomAccent(),
	fromSnake?: boolean,
): CandyEntity {
	return { id: `candy-${nextCandyId++}`, type: "static", color, size, position, fromSnake };
}

function populateCandy(amount: number) {
	store.populateCandy(fillArray(amount, () => createCandy()));
}

function eatCandy(snake: SnakeEntity, id: string) {
	const candy = store.getState(selectCandyById(id));

	if (!candy || candy.eatenAt) {
		return;
	}

	store.setCandyEatenAt(candy.id, snake.head);
	store.incrementSnakeScore(snake.id, candy.size);

	setTimeout(() => {
		store.removeCandy(candy.id);
	}, 0.5);
}

function createCandyOnSnake(id: string): void {
	const snake = store.getState(selectSnakeById(id));

	if (!snake) {
		return;
	}

	const candies = snake.segments.map((segment, index) => {
		const skin = getSnakeSegmentSkin(snake.skin, index);
		return createCandy(random.NextInteger(30, 50), segment, skin.tint, true);
	});

	store.populateCandy(candies);
}
