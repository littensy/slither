import { CombineStates } from "@rbxts/reflex";
import { candySlice } from "./candy";
import { saveSlice } from "./saves";
import { snakesSlice } from "./snakes";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	candy: candySlice,
	snakes: snakesSlice,
	saves: saveSlice,
};
