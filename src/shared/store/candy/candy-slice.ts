import { createProducer } from "@rbxts/reflex";
import { mapObject } from "shared/utils/object-utils";

export interface CandyState {
	readonly static: {
		readonly [id: string]: CandyEntity | undefined;
	};
}

export interface CandyEntity {
	readonly id: string;
	readonly size: number;
	readonly position: Vector2;
	readonly color: Color3;
	readonly type: CandyType;
	readonly eatenAt?: Vector2;
}

export type CandyType = "static" | "chase";

const initialState: CandyState = {
	static: {},
};

export const candySlice = createProducer(initialState, {
	populateCandy: (state, candy: CandyEntity[]) => ({
		...state,
		static: {
			...state.static,
			...candy.reduce<Record<string, CandyEntity>>((map, candy) => {
				if (candy.type === "static") {
					map[candy.id] = candy;
				}
				return map;
			}, {}),
		},
	}),

	addCandy: (state, candy: CandyEntity) => ({
		...state,
		static: {
			...state.static,
			[candy.id]: candy,
		},
	}),

	removeCandy: (state, id: string) => ({
		...state,
		static: {
			...state.static,
			[id]: undefined,
		},
	}),

	setCandyEatenAt: (state, id: string, eatenAt: Vector2) => ({
		...state,
		static: mapObject(state.static, (candy) => {
			if (candy.id !== id) {
				return candy;
			}
			return { ...candy, eatenAt };
		}),
	}),
});
