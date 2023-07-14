import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { Vector, createQuadtree } from "server/utils/quadtree";
import { WORLD_BOUNDS, WORLD_MAX_CANDY } from "shared/constants";
import { getRandomAccent } from "shared/data/palette";
import { getSnakeSegmentSkin } from "shared/data/skins";
import {
	CandyEntity,
	candyDiscriminator,
	selectCandyById,
	selectStaticCandiesUneaten,
	selectStaticCandyCount,
} from "shared/store/candy";
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

const createCandyId = ({ X, Y }: Vector) => `candy-${X}-${Y}`;

export function connectCandyWorker() {
	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	const controlPopulation = store.subscribe(
		selectStaticCandyCount,
		(count) => count < WORLD_MAX_CANDY,
		(count) => populateCandy(WORLD_MAX_CANDY - count),
	);

	// when a candy is added, add it to the quadtree
	const candyObserver = store.observe(selectStaticCandiesUneaten, candyDiscriminator, (candy) => {
		quadtree.insert(candy.position);

		return () => {
			quadtree.remove(candy.position);
		};
	});

	// when a snake dies, create candy on the snake's segments so
	// that other snakes can eat it
	const snakeObserver = store.observe(selectDeadSnakesById, snakeDiscriminator, (snake) => {
		createCandyOnSnake(snake);
	});

	populateCandy(WORLD_MAX_CANDY);

	return () => {
		controlPopulation();
		candyObserver();
		snakeObserver();
	};
}

export function handleCandyUpdate() {
	for (const [, snake] of pairs(store.getState(selectSnakesById))) {
		if (snake.dead) {
			continue;
		}

		const { radius } = describeSnakeFromScore(snake.score);

		const results = quadtree.queryRange({
			position: snake.head,
			radius: 2 * radius,
		});

		for (const candyNode of results) {
			eatCandy(snake, createCandyId(candyNode));
		}
	}
}

export function createCandy(
	size = random.NextInteger(0, 20),
	position = new Vector2(random.NextNumber(-1, 1), random.NextNumber(-1, 1)).mul(WORLD_BOUNDS),
	color = getRandomAccent(),
): CandyEntity {
	return { id: createCandyId(position), type: "static", color, size, position };
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
