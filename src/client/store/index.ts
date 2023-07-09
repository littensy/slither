import { InferState, combineProducers } from "@rbxts/reflex";
import { IS_EDIT } from "shared/constants";
import { slices } from "shared/store";
import { receiverMiddleware } from "./middleware/receiver-middleware";

export type RootStore = typeof store;

export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
	});

	if (!IS_EDIT) {
		store.applyMiddleware(receiverMiddleware());
	}

	return store;
}

export const store = createStore();
