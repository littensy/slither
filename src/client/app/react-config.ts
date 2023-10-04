import { RunService } from "@rbxts/services";
import { IS_CANARY } from "shared/constants/core";

declare const _G: { __DEV__: boolean };

if (RunService.IsStudio()) {
	_G.__DEV__ = true;
}

if (IS_CANARY) {
	// Avoid implicit React import before setting the __DEV__ flag
	import("client/utils/profiler").then(({ profileAllComponents }) => {
		profileAllComponents();
	});
}
