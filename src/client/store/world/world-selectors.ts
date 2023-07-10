import { createSelector } from "@rbxts/reflex";
import { getSegmentRadius } from "shared/store/snakes";
import { RootState } from "../";

export interface WorldCamera {
	readonly offset: Vector2;
	readonly scale: number;
}

const WORLD_SCALE = 3;

export const selectWorldFocus = (state: RootState) => {
	return state.world.focus;
};

export const selectSnakeInFocus = (state: RootState) => {
	return state.snakes[state.world.focus];
};

export const selectWorldCamera = createSelector(
	[selectSnakeInFocus],
	(snake) => {
		if (!snake) {
			return {
				offset: new Vector2(),
				scale: 1,
			};
		}

		return {
			offset: snake.head.mul(-1),
			scale: WORLD_SCALE / getSegmentRadius(snake.score),
		};
	},
	{
		// only re-compute if the snake is not null
		equalityCheck: (current, previous) => current === previous || current === undefined,
	},
);
