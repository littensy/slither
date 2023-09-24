import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/store";

import { alertSlice } from "./alert";
import { menuSlice } from "./menu";
import { profilerMiddleware } from "./middleware/profiler";
import { receiverMiddleware } from "./middleware/receiver";
import { worldSlice } from "./world";

export type RootStore = typeof store;

export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
		alert: alertSlice,
		menu: menuSlice,
		world: worldSlice,
	});

	store.applyMiddleware(profilerMiddleware, receiverMiddleware());

	return store;
}

export const store = createStore();
