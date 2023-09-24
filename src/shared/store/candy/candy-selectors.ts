import Object from "@rbxts/object-utils";
import { createSelector } from "@rbxts/reflex";
import { mapProperties } from "shared/utils/object-utils";

import { SharedState } from "..";
import { CandyEntity, CandyType } from "./candy-slice";

export const identifyCandy = (candy: CandyEntity) => {
	return candy.id;
};

export const selectCandiesById = (state: SharedState) => {
	return state.candy;
};

export const selectCandies = createSelector(selectCandiesById, (byId) => {
	return Object.values(byId);
});

export const selectCandiesByIdOfType = (candyType: CandyType) => {
	return createSelector(selectCandiesById, (byId) => {
		return mapProperties(byId, (candy) => {
			return candy.type === candyType && !candy.eatenAt ? candy : undefined;
		});
	});
};

export const selectCandiesUneaten = createSelector(selectCandies, (candies) => {
	return candies.filter((candy) => !candy.eatenAt);
});

export const selectCandyCount = (filter?: CandyType) => {
	return createSelector(selectCandiesById, (byId) => {
		let size = 0;

		for (const [, candy] of pairs(byId)) {
			if (candy.eatenAt || (filter !== undefined && candy.type !== filter)) {
				continue;
			}

			size += 1;
		}

		return size;
	});
};

export const selectCandyById = (id: string) => {
	return (state: SharedState) => {
		return state.candy[id];
	};
};
