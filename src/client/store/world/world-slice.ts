import { createProducer } from "@rbxts/reflex";

export interface WorldState {
	readonly subject: string;
}

const initialState: WorldState = {
	subject: "",
};

export const worldSlice = createProducer(initialState, {
	setWorldSubject: (state, snake: string) => ({
		...state,
		subject: snake,
	}),
});
