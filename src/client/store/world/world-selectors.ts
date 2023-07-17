import { createSelector } from "@rbxts/reflex";
import { map } from "shared/utils/math-utils";
import { RootState } from "../";

export interface WorldCamera {
	readonly offset: Vector2;
	readonly scale: number;
}

const WORLD_SCALE = 4;

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
				scale: WORLD_SCALE,
			};
		}

		return {
			offset: snake.head.mul(-1),
			scale: map(snake.score, 0, 8000, WORLD_SCALE, WORLD_SCALE * 0.3),
		};
	},
	{
		// only re-compute if the snake is not null
		equalityCheck: (current, previous) => current === previous || current === undefined,
	},
);
