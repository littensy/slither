import { RunService } from "@rbxts/services";

declare const _G: {
	__DEV__: boolean;
	__REACT_MICROPROFILER_LEVEL: number;
};

if (RunService.IsStudio()) {
	_G.__DEV__ = true;
	_G.__REACT_MICROPROFILER_LEVEL = 10;
}
