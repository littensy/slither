import Object from "@rbxts/object-utils";
import { createSelector, shallowEqual } from "@rbxts/reflex";
import { LOCAL_USER } from "shared/constants";
import { SharedState } from "shared/store";
import { mapProperties } from "shared/utils/object-utils";
import { getPlayerByName } from "shared/utils/player-utils";

import { SnakeEntity } from "./snake-slice";
import { snakeIsBoosting } from "./snake-utils";

export const identifySnake = (snake: SnakeEntity) => {
	return snake.id;
};

export const cycleNextSnake = (currentId: string) => (state: SharedState) => {
	const snakes = selectSnakesSorted((a, b) => a.score > b.score)(state);
	const index = snakes.findIndex((snake) => snake.id === currentId);

	if (index !== -1) {
		return snakes[(index + 1) % snakes.size()]?.id;
	} else {
		return snakes[0]?.id;
	}
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
	return mapProperties(snakesById, (snake) => (snake.dead ? snake : undefined));
});

export const selectAliveSnakesById = createSelector(selectSnakesById, (snakesById) => {
	return mapProperties(snakesById, (snake) => (!snake.dead ? snake : undefined));
});

export const selectPlayerSnakesById = createSelector(selectSnakesById, (snakesById) => {
	return mapProperties(snakesById, (snake) => (getPlayerByName(snake.id) ? snake : undefined));
});

export const selectPlayerCountIsAbove = (count: number) => {
	return createSelector(selectPlayerSnakesById, (snakesById) => {
		let playerCount = 0;

		for (const [,] of pairs(snakesById)) {
			playerCount++;

			if (playerCount >= count) {
				return true;
			}
		}

		return false;
	});
};

export const selectLocalSnake = (state: SharedState) => {
	return state.snakes[LOCAL_USER];
};

export const selectLocalSnakeScore = (state: SharedState) => {
	return state.snakes[LOCAL_USER]?.score;
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

export const selectSnakeScore = (id: string) => {
	return (state: SharedState) => state.snakes[id]?.score;
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

export const selectSnakeRanking = (id: string) => {
	const comparator = (current: SnakeEntity, existing: SnakeEntity) => {
		return current.score > existing.score;
	};

	return createSelector(selectSnakesSorted(comparator), (snakes) => {
		const index = snakes.findIndex((snake) => snake.id === id);

		return index === -1 ? undefined : index + 1;
	});
};

export const selectLocalSnakeRanking = selectSnakeRanking(LOCAL_USER);

export const selectRankForDisplay = (state: SharedState) => {
	const ranking = selectLocalSnakeRanking(state);

	if (ranking === undefined) {
		return;
	}

	const lastDigit = ranking % 10;
	const lastTwoDigits = ranking % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
		return `${ranking}th`;
	} else if (lastDigit === 1) {
		return `${ranking}st`;
	} else if (lastDigit === 2) {
		return `${ranking}nd`;
	} else if (lastDigit === 3) {
		return `${ranking}rd`;
	} else {
		return `${ranking}th`;
	}
};
