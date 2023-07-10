import { createProducer } from "@rbxts/reflex";

export interface WorldState {
	readonly focus: string;
}

const initialState: WorldState = {
	focus: "",
};

export const worldSlice = createProducer(initialState, {
	setWorldFocus: (state, snake: string) => ({ ...state, focus: snake }),
});
