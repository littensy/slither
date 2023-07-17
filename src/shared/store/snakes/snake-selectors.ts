import Object from "@rbxts/object-utils";
import { createSelector, shallowEqual } from "@rbxts/reflex";
import { LOCAL_USER } from "shared/constants";
import { SharedState } from "shared/store";
import { mapObject } from "shared/utils/object-utils";
import { SnakeEntity } from "./snake-slice";
import { snakeIsBoosting } from "./snake-utils";

export const identifySnake = (snake: SnakeEntity) => {
	return snake.id;
};

export const selectSnakesById = (state: SharedState) => {
	return state.snakes;
};

export const selectSnakeCount = createSelector(selectSnakesById, (snakesById) => {
	let count = 0;

	for (const [,] of pairs(snakesById)) {
		count++;
	}

	return count;
});

export const selectDeadSnakesById = createSelector(selectSnakesById, (snakesById) => {
	return mapObject(snakesById, (snake) => (snake.dead ? snake : undefined));
});

export const selectAliveSnakesById = createSelector(selectSnakesById, (snakesById) => {
	return mapObject(snakesById, (snake) => (!snake.dead ? snake : undefined));
});

export const selectLocalSnake = (state: SharedState) => {
	return state.snakes[LOCAL_USER];
};

export const selectHasLocalSnake = (state: SharedState) => {
	return LOCAL_USER in state.snakes;
};

export const selectSnakes = createSelector(selectSnakesById, (snakesById) => {
	return Object.values(snakesById);
});

export const selectTopSnake = createSelector(selectSnakesById, (snakesById) => {
	let topSnake: SnakeEntity | undefined;

	for (const [, snake] of pairs(snakesById)) {
		if (topSnake === undefined || snake.score > topSnake.score) {
			topSnake = snake;
		}
	}

	return topSnake;
});

export const selectSnakesSorted = (comparator: (current: SnakeEntity, existing: SnakeEntity) => boolean) => {
	return createSelector(selectSnakesById, (snakesById) => {
		const topSnakes: SnakeEntity[] = [];

		for (const [, snake] of pairs(snakesById)) {
			const index = topSnakes.findIndex((topSnake) => comparator(snake, topSnake));

			if (index === -1) {
				topSnakes.push(snake);
			} else {
				topSnakes.insert(index, snake);
			}
		}

		return topSnakes;
	});
};

export const selectSnakeIds = createSelector(
	[selectSnakesById],
	(snakesById) => {
		return Object.keys(snakesById) as readonly string[];
	},
	shallowEqual,
);

export const selectSnakeById = (id: string) => {
	return (state: SharedState) => state.snakes[id];
};

export const selectSnakeIsDead = (id: string) => {
	return (state: SharedState) => {
		const snake = state.snakes[id];
		return snake ? snake.dead : true;
	};
};

export const selectSnakeIsBoosting = (id: string) => {
	return (state: SharedState) => {
		const snake = state.snakes[id];
		return snake ? snakeIsBoosting(snake) : false;
	};
};
