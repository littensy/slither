/// <reference types="@rbxts/testez/globals" />

import { initRewardServices } from "server/rewards";

import { resetStore } from "../helpers/reset-store";

export = () => {
	beforeAll(() => {
		initRewardServices();
	});

	beforeEach(() => {
		resetStore();
	});

	afterEach(() => {
		resetStore();
	});
};
