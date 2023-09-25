import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/store";
import { profilerMiddleware } from "shared/store/middleware/profiler";

import { alertSlice } from "./alert";
import { menuSlice } from "./menu";
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
