import { StarterGui } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { retryCore } from "./utils";

const resetBindable = new Instance("BindableEvent");

resetBindable.Event.Connect(() => {
	remotes.snake.kill.fire();
});

retryCore(() => {
	StarterGui.SetCore("ResetButtonCallback", resetBindable);
});
