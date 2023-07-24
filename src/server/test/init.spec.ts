/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";
import { store } from "server/store";
import { disconnectAllSchedulers } from "shared/utils/scheduler";

export = () => {
	afterAll(() => {
		if (RunService.IsRunMode()) {
			return;
		}

		store.destroy();
		disconnectAllSchedulers();
	});
};
