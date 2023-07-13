import Object from "@rbxts/object-utils";
import { createSelector, shallowEqual } from "@rbxts/reflex";
import { LOCAL_USER } from "shared/constants";
import { SharedState } from "shared/store";
import { mapObject } from "shared/utils/object-utils";
import { SnakeEntity } from "./snake-slice";

export const snakeDiscriminator = (snake: SnakeEntity) => {
	return snake.id;
};

export const selectSnakesById = (state: SharedState) => {
	return state.snakes;
};

export const selectDeadSnakesById = createSelector(selectSnakesById, (snakesById) => {
	return mapObject(snakesById, (snake) => (snake.dead ? snake : undefined));
});

export const selectLocalSnake = (state: SharedState) => {
	return state.snakes[LOCAL_USER];
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
