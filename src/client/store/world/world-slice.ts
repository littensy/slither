import { createProducer } from "@rbxts/reflex";

export interface WorldState {
	readonly subject: string;
	readonly spectating: string;
	readonly inputAngle: number;
}

const initialState: WorldState = {
	subject: "",
	spectating: "",
	inputAngle: 0,
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

	setWorldInputAngle: (state, inputAngle: number) => ({
		...state,
		inputAngle,
	}),
});
