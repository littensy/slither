import { RunService } from "@rbxts/services";
import { setTimeout } from "@rbxts/set-timeout";

/**
 * Allow TestService to initialize before running tests.
 */
export function afterTests(callback: () => void) {
	setTimeout(callback, RunService.IsStudio() ? 0.5 : 0);
}
