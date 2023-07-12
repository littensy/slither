import { createProducer } from "@rbxts/reflex";

export interface CandyState {
	readonly static: {
		readonly [id: string]: CandyEntity | undefined;
	};
}

export interface CandyEntity {
	readonly id: string;
	readonly size: number;
	readonly position: Vector2;
}

export type CandyType = "static" | "chase";

const initialState: CandyState = {
	static: {},
};

export const candySlice = createProducer(initialState, {
	populateStaticCandy: (state, candy: CandyEntity[]) => ({
		...state,
		static: {
			...state.static,
			...candy.reduce<Record<string, CandyEntity>>((map, candy) => {
				map[candy.id] = candy;
				return map;
			}, {}),
		},
	}),

	addStaticCandy: (state, candy: CandyEntity) => ({
		...state,
		static: {
			...state.static,
			[candy.id]: candy,
		},
	}),

	removeStaticCandy: (state, id: string) => ({
		...state,
		static: {
			...state.static,
			[id]: undefined,
		},
	}),
});
