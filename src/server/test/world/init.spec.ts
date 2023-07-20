/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { candyGrid } from "server/world/workers/candy-worker";

export = () => {
	beforeEach(() => {
		store.resetState();
	});

	afterEach(() => {
		store.resetState();
		candyGrid.clear();
	});
};
