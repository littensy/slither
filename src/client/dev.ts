import { RunService } from "@rbxts/services";

declare const _G: { __DEV__: boolean };

if (RunService.IsStudio()) {
	_G.__DEV__ = true;
}
