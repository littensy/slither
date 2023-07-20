import { createProducer } from "@rbxts/reflex";
import { mapObject } from "shared/utils/object-utils";

export interface CandyState {
	readonly [id: string]: CandyEntity | undefined;
}

export interface CandyEntity {
	readonly id: string;
	readonly size: number;
	readonly position: Vector2;
	readonly color: Color3;
	readonly type: CandyType;
	readonly eatenAt?: Vector2;
}

export type CandyType = "default" | "loot" | "dropping";

const initialState: CandyState = {};

export const candySlice = createProducer(initialState, {
	populateCandy: (state, candy: CandyEntity[]) => ({
		...state,
		...candy.reduce<{ [id: string]: CandyEntity }>((map, candy) => {
			map[candy.id] = candy;
			return map;
		}, {}),
	}),

	addCandy: (state, candy: CandyEntity) => ({
		...state,
		[candy.id]: candy,
	}),

	removeCandy: (state, id: string) => ({
		...state,
		[id]: undefined,
	}),

	setCandyEatenAt: (state, id: string, eatenAt: Vector2) => {
		return mapObject(state, (candy) => {
			if (candy.id !== id) {
				return candy;
			}
			return { ...candy, eatenAt };
		});
	},
});
