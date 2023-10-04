import { IS_CANARY } from "shared/constants/core";

declare const _G: { __DEV__: boolean };

if (IS_CANARY) {
	_G.__DEV__ = true;
}
