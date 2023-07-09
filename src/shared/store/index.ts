import { CombineStates } from "@rbxts/reflex";

export type SharedState = CombineStates<typeof slices>;

export const slices = {};
