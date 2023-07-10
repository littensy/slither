import Object from "@rbxts/object-utils";
import { createSelector } from "@rbxts/reflex";
import { SharedState } from "shared/store";

export const selectSnakesById = (state: SharedState) => {
	return state.snakes;
};

export const selectSnakes = createSelector(selectSnakesById, (snakesById) => {
	return Object.values(snakesById);
});

export const selectSnakeById = (id: string) => {
	return (state: SharedState) => {
		return state.snakes[id];
	};
};
