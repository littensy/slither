import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getRandomPointNearWorldOrigin } from "server/world/utils/spawn-utils";
import { getCandy, getSnake } from "server/world/utils/world-utils";
import { CANDY_LIMITS } from "shared/constants";
import { getRandomAccent } from "shared/data/palette";
import { CandyEntity, CandyType, selectCandyById, selectCandyCount, selectStaleCandyOfType } from "shared/store/candy";
import { createGrid } from "shared/utils/grid";
import { fillArray } from "shared/utils/object-utils";

export const candyGrid = createGrid<{ id: string }>(5);

let nextCandyId = 0;

export function createCandy(patch?: Partial<CandyEntity>): CandyEntity {
	const random = new Random();

	const candy: CandyEntity = {
		id: `${nextCandyId++}`,
		type: "default",
		size: math.min(random.NextInteger(1, 6), random.NextInteger(1, 6)),
		position: getRandomPointNearWorldOrigin(0.95),
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

	if (count <= max) {
		return;
	}

	for (const _ of $range(max, count - 1)) {
		const candy = store.getState(selectStaleCandyOfType(candyType));

		if (candy) {
			removeCandy(candy.id);
		}
	}
}
