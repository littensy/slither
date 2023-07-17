import Object from "@rbxts/object-utils";
import { createSelector } from "@rbxts/reflex";
import { SharedState } from "../";
import { CandyEntity } from "./candy-slice";

export const identifyCandy = (candy: CandyEntity) => {
	return candy.id;
};

export const selectStaticCandiesById = (state: SharedState) => {
	return state.candy.static;
};

export const selectStaticCandies = createSelector(selectStaticCandiesById, (staticCandiesById) => {
	return Object.values(staticCandiesById);
});

export const selectStaticCandiesUneaten = createSelector(selectStaticCandies, (candies) => {
	return candies.filter((candy) => !candy.eatenAt);
});

export const selectStaticCandyCount = createSelector(selectStaticCandiesById, (staticCandiesById) => {
	let size = 0;

	for (const [, candy] of pairs(staticCandiesById)) {
		size += 1;
	}

	return size;
});

export const selectSpawnedCandyCount = createSelector(selectStaticCandiesById, (staticCandiesById) => {
	let size = 0;

	for (const [, candy] of pairs(staticCandiesById)) {
		if (!candy.fromSnake) {
			size += 1;
		}
	}

	return size;
});

export const selectCandyById = (id: string) => {
	return (state: SharedState) => {
		return state.candy.static[id];
	};
};
