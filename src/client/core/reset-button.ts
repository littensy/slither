import { StarterGui } from "@rbxts/services";
import { remotes } from "shared/remotes";

import { retry } from "./utils";

const resetBindable = new Instance("BindableEvent");

resetBindable.Event.Connect(() => {
	remotes.snake.kill.fire();
});

retry(() => {
	StarterGui.SetCore("ResetButtonCallback", resetBindable);
});
