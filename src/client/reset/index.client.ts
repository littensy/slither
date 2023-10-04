import { StarterGui } from "@rbxts/services";
import { remotes } from "shared/remotes";

async function setCore() {
	const resetBindable = new Instance("BindableEvent");

	resetBindable.Event.Connect(() => {
		remotes.snake.kill.fire();
	});

	StarterGui.SetCore("ResetButtonCallback", resetBindable);
}

Promise.retryWithDelay(setCore, 10, 5);
