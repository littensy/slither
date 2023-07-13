import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { createQuadtree } from "server/utils/quadtree";
import { WORLD_BOUNDS, WORLD_MAX_CANDY } from "shared/constants";
import { getRandomAccent } from "shared/data/palette";
import { getSnakeSegmentSkin } from "shared/data/skins";
import { CandyEntity, selectCandyByPosition, selectStaticCandyCount } from "shared/store/candy";
import {
	SnakeEntity,
	describeSnakeFromScore,
	selectDeadSnakesById,
	selectSnakesById,
	snakeDiscriminator,
} from "shared/store/snakes";
import { fillArray } from "shared/utils/object-utils";

const quadtree = createQuadtree(new Vector2(WORLD_BOUNDS, WORLD_BOUNDS));
const random = new Random();

export function connectCandyWorker() {
	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	const unsubscribe = store.subscribe(
		selectStaticCandyCount,
		(count) => count < WORLD_MAX_CANDY,
		(count) => populateCandy(WORLD_MAX_CANDY - count),
	);

	// when a snake dies, create candy on the snake's segments so
	// that other snakes can eat it
	const disconnect = store.observe(selectDeadSnakesById, snakeDiscriminator, (snake) => {
		createCandyOnSnake(snake);
	});

	populateCandy(WORLD_MAX_CANDY);

	return () => {
		unsubscribe();
		disconnect();
	};
}

export function handleCandyUpdate() {
	for (const [, snake] of pairs(store.getState(selectSnakesById))) {
		const { radius } = describeSnakeFromScore(snake.score);

		const results = quadtree.queryRange({
			position: snake.head,
			radius: 2 * radius,
		});

		for (const candyNode of results) {
			eatCandy(snake, candyNode);
		}
	}
}

function createCandy(
	size = random.NextInteger(0, 20),
	position = new Vector2(random.NextNumber(-0.5, 0.5), random.NextNumber(-0.5, 0.5)).mul(WORLD_BOUNDS),
	color = getRandomAccent(),
): CandyEntity {
	quadtree.insert(position);
	return { id: `${position}`, type: "static", color, size, position };
}

function populateCandy(amount: number) {
	store.populateCandy(fillArray(amount, () => createCandy()));
}

function eatCandy(snake: SnakeEntity, candyNode: Vector3) {
	const candy = store.getState(selectCandyByPosition(candyNode));

	if (!candy || candy.eatenAt) {
		return;
	}

	quadtree.remove(candyNode);
	store.setCandyEatenAt(candy.id, snake.head);
	store.incrementSnakeScore(snake.id, candy.size);

	setTimeout(() => {
		store.removeCandy(candy.id);
	}, 0.5);
}

function createCandyOnSnake(snake: SnakeEntity): void {
	snake.segments.forEach((segment, index) => {
		const skin = getSnakeSegmentSkin(snake.skin, index);
		createCandy(random.NextInteger(30, 50), segment, skin.tint);
	});
}
