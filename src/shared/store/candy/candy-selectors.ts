import Object from "@rbxts/object-utils";
import { createSelector } from "@rbxts/reflex";
import { SharedState } from "../";

export const selectStaticCandiesById = (state: SharedState) => {
	return state.candy.static;
};

export const selectStaticCandies = createSelector(selectStaticCandiesById, (staticCandiesById) => {
	return Object.values(staticCandiesById);
});

export const selectStaticCandyCount = createSelector(selectStaticCandiesById, (staticCandiesById) => {
	let size = 0;

	for (const _ of pairs(staticCandiesById)) {
		size += 1;
	}

	return size;
});

export const selectCandyById = (id: string) => {
	return (state: SharedState) => {
		return state.candy.static[id];
	};
};

export const selectCandyByPosition = (position: { X: number; Y: number }) => {
	return (state: SharedState) => {
		return state.candy.static[`${position}`];
	};
};
