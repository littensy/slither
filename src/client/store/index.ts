import { combineProducers, InferState } from "@rbxts/reflex";
import { IS_EDIT } from "shared/constants";
import { slices } from "shared/store";

import { menuSlice } from "./menu";
import { receiverMiddleware } from "./middleware/receiver-middleware";
import { worldSlice } from "./world";

export type RootStore = typeof store;

export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
		menu: menuSlice,
		world: worldSlice,
	});

	if (!IS_EDIT) {
		store.applyMiddleware(receiverMiddleware());
	}

	return store;
}

export const store = createStore();
