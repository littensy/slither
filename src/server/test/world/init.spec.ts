/// <reference types="@rbxts/testez/globals" />

import "server/world/services";
import { store } from "server/store";
import { candyGrid } from "server/world/services/candy-service";

export = () => {
	/**
	 * To prevent the state from being polluted between tests, we flush the state
	 * before and after resetting it. This ensures that subscriptions run for the
	 * changes they were intended to run for, and resets are handled separately.
	 */
	const reset = () => {
		store.flush();
		store.resetState();
		store.flush();
	};

	beforeEach(() => {
		reset();
	});

	afterEach(() => {
		reset();
		candyGrid.clear();
	});
};
