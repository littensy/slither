import { createProducer } from "@rbxts/reflex";

export interface WorldState {
	readonly subject: string;
	readonly spectating: string;
}

const initialState: WorldState = {
	subject: "",
	spectating: "",
};

export const worldSlice = createProducer(initialState, {
	setWorldSubject: (state, subject: string) => ({
		...state,
		subject,
	}),

	setWorldSpectating: (state, spectating: string) => ({
		...state,
		spectating,
	}),
});
