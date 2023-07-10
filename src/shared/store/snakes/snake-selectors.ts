import Object from "@rbxts/object-utils";
import { createSelector, shallowEqual } from "@rbxts/reflex";
import { SharedState } from "shared/store";

export const selectSnakesById = (state: SharedState) => {
	return state.snakes;
};

export const selectSnakes = createSelector(selectSnakesById, (snakesById) => {
	return Object.values(snakesById);
});

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
