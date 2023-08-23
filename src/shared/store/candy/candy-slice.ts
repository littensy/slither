import { createProducer } from "@rbxts/reflex";
import { assign, mapProperty } from "shared/utils/object-utils";

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

export enum CandyType {
	Default,
	Loot,
	Dropping,
}

const initialState: CandyState = {};

export const candySlice = createProducer(initialState, {
	populateCandy: (state, candy: CandyEntity[]) => {
		return assign(
			state,
			candy.reduce<{ [id: string]: CandyEntity }>((map, candy) => {
				map[candy.id] = candy;
				return map;
			}, {}),
		);
	},

	addCandy: (state, candy: CandyEntity) => {
		return assign(state, { [candy.id]: candy });
	},

	removeCandy: (state, id: string) => {
		return mapProperty(state, id, () => undefined);
	},

	setCandyEatenAt: (state, id: string, eatenAt: Vector2) => {
		return mapProperty(state, id, (candy) => ({
			...candy,
			eatenAt,
		}));
	},
});
