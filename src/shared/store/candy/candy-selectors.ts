import Object from "@rbxts/object-utils";
import { createSelector, shallowEqual } from "@rbxts/reflex";
import { SharedState } from "../";

export const selectStaticCandiesById = (state: SharedState) => {
	return state.candy.static;
};

export const selectStaticCandies = createSelector(
	[selectStaticCandiesById],
	(staticCandiesById) => {
		return Object.values(staticCandiesById);
	},
	shallowEqual,
);
