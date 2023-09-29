import { setInterval, setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { CANDY_LIMITS } from "server/world/constants";
import { getCandy, getRandomPointNearWorldOrigin, getSnake } from "server/world/utils";
import { getRandomAccent } from "shared/data/palette";
import { getSnakeSkinForTracer } from "shared/data/skins";
import { CandyEntity, CandyType, selectCandyById, selectCandyCount } from "shared/store/candy";
import { describeSnakeFromScore, selectSnakeIsBoosting } from "shared/store/snakes";
import { Grid } from "shared/utils/grid";
import { fillArray } from "shared/utils/object-utils";

const random = new Random();

export const candyGrid = new Grid<{ id: string }>(5);

let nextCandyId = 0;

export function createCandy(patch?: Partial<CandyEntity>): CandyEntity {
	const random = new Random();

	const candy: CandyEntity = {
		id: `${nextCandyId++}`,
		type: CandyType.Default,
		size: math.min(random.NextInteger(1, 4), random.NextInteger(1, 5)),
		position: getRandomPointNearWorldOrigin(0.98),
		color: getRandomAccent(),
		...patch,
	};

	candyGrid.insert(candy.position, { id: candy.id });

	return candy;
}

export function removeCandy(id: string, eatenAt?: Vector2) {
	const candy = store.getState(selectCandyById(id));

	if (!candy) {
		return;
	}

	store.setCandyEatenAt(id, eatenAt ?? candy.position);
	candyGrid.remove(candy.position);

	setTimeout(() => {
		store.removeCandy(id);
	}, 5);
}

export function eatCandy(candyId: string, snakeId: string) {
	const candy = getCandy(candyId);
	const snake = getSnake(snakeId);

	if (snake && candy && !candy.eatenAt) {
		removeCandy(candy.id, snake.head);
		store.incrementSnakeScore(snake.id, candy.size);
	}
}

export function populateCandy(amount: number) {
	store.populateCandy(fillArray(amount, () => createCandy()));
}

export function removeCandyIfAtLimit(candyType: CandyType) {
	const max = CANDY_LIMITS[candyType];
	const count = store.getState(selectCandyCount(candyType));

	if (count > max) {
		store.bulkRemoveStaleCandy(candyType, count - max);
	}
}

export function dropCandyWhileBoosting(id: string) {
	return store.observeWhile(selectSnakeIsBoosting(id), () => {
		let previousTail = Vector2.zero;

		const dropCandy = () => {
			const snake = getSnake(id);

			if (!snake) {
				return;
			}

			const description = describeSnakeFromScore(snake.score);
			const tail = snake.tracers[snake.tracers.size() - 1] || snake.head;

			if (tail.sub(previousTail).Magnitude < description.radius * 2) {
				return;
			}

			previousTail = tail;

			const candy = createCandy({
				size: random.NextInteger(1, 5),
				position: tail,
				type: CandyType.Dropping,
			});

			store.addCandy(candy);
		};

		store.incrementSnakeScore(id, 4);

		return setInterval(() => {
			store.incrementSnakeScore(id, random.NextInteger(-4, -1));
			dropCandy();
		}, 0.15);
	});
}

export function dropCandyOnDeath(id: string): void {
	const snake = getSnake(id);

	if (!snake) {
		return;
	}

	const tracers = [...snake.tracers, snake.head];
	const tracerRadius = describeSnakeFromScore(snake.score).radius;
	const candyPositions: Vector2[] = [];
	let lastTracer: Vector2 | undefined;

	for (const tracer of tracers) {
		// to prevent candy bunching up in certain areas, don't insert the
		// position of the tracer if it's too close to the last spawned candy
		if (lastTracer && tracer.sub(lastTracer).Magnitude < 0.25 * tracerRadius) {
			continue;
		}

		lastTracer = tracer;

		// create multiple candies on this tracer based on radius
		const amount = math.round(random.NextNumber(1, math.max(tracerRadius, 1)));

		for (const _ of $range(1, amount)) {
			const x = random.NextNumber(-1, 1) * tracerRadius;
			const y = random.NextNumber(-1, 1) * tracerRadius;

			candyPositions.push(tracer.add(new Vector2(x, y)));
		}
	}

	// the total worth of the loot should scale logarithmically with the
	// snake's score, but not exceed the score itself
	const sum = math.min(8000 * math.log10(snake.score / 3000 + 1), snake.score);
	const total = candyPositions.size();

	const candies = candyPositions.mapFiltered((position, index) => {
		const skin = getSnakeSkinForTracer(snake.skin, index);

		return createCandy({
			position,
			type: CandyType.Loot,
			size: math.ceil(sum / total),
			color: skin.boostTint || skin.tint,
		});
	});

	store.populateCandy(candies);
}
