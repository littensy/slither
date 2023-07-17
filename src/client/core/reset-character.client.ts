import { StarterGui } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { coreEvent, retryCore } from "./utils";

const resetBindable = coreEvent(() => {
	remotes.snake.kill.fire();
});

retryCore(() => {
	StarterGui.SetCore("ResetButtonCallback", resetBindable);
});
