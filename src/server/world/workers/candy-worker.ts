import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { WORLD_BOUNDS, WORLD_MAX_CANDY } from "shared/constants";
import { getRandomAccent } from "shared/data/palette";
import { getSnakeSegmentSkin } from "shared/data/skins";
import { CandyEntity, selectCandyById, selectStaticCandiesById, selectStaticCandyCount } from "shared/store/candy";
import {
	SnakeEntity,
	describeSnakeFromScore,
	identifySnake,
	selectDeadSnakesById,
	selectSnakesById,
} from "shared/store/snakes";
import { fillArray } from "shared/utils/object-utils";

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

	// when a snake dies, create candy on the snake's segments so
	// that other snakes can eat it
	const snakeObserver = store.observe(selectDeadSnakesById, identifySnake, (snake) => {
		createCandyOnSnake(snake);
	});

	populateCandy(WORLD_MAX_CANDY);

	return () => {
		controlPopulation();
		snakeObserver();
	};
}

export function onCandyStep() {
	const snakes = store.getState(selectSnakesById);
	const candies = store.getState(selectStaticCandiesById);

	for (const [, snake] of pairs(snakes)) {
		if (snake.dead) {
			continue;
		}

		const description = describeSnakeFromScore(snake.score);
		const range = description.radius * 2;

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
	size = random.NextInteger(0, 20),
	position = new Vector2(random.NextNumber(-1, 1), random.NextNumber(-1, 1)).mul(WORLD_BOUNDS),
	color = getRandomAccent(),
): CandyEntity {
	return { id: `candy-${nextCandyId++}`, type: "static", color, size, position };
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

function createCandyOnSnake(snake: SnakeEntity): void {
	const candies = snake.segments.map((segment, index) => {
		const skin = getSnakeSegmentSkin(snake.skin, index);
		return createCandy(random.NextInteger(30, 50), segment, skin.tint);
	});

	store.populateCandy(candies);
}
