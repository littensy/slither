import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/store";
import { profilerMiddleware } from "shared/store/middleware/profiler";

import { broadcasterMiddleware } from "./middleware/broadcaster";
import { milestoneSlice } from "./milestones";

export type RootState = InferState<typeof store>;

export function createStore() {
	const store = combineProducers({
		...slices,
		milestones: milestoneSlice,
	});

	store.applyMiddleware(profilerMiddleware, broadcasterMiddleware());

	return store;
}

export const store = createStore();
