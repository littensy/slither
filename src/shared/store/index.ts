import { CombineStates } from "@rbxts/reflex";
import { snakesSlice } from "./snakes";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	snakes: snakesSlice,
};
