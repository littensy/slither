import { createBroadcastReceiver } from "@rbxts/reflex";
import { setInterval } from "@rbxts/set-timeout";
import { remotes } from "shared/remotes";

export function receiverMiddleware() {
	const receiver = createBroadcastReceiver({
		start: () => {
			remotes.store.start.fire();
		},
	});

	remotes.store.dispatch.connect((actions) => {
		print("dispatch");
		receiver.dispatch(actions);
	});

	setInterval(() => {
		print("------");
	}, 1);

	return receiver.middleware;
}
