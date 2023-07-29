import { createBroadcastReceiver } from "@rbxts/reflex";
import { remotes } from "shared/remotes";

export function receiverMiddleware() {
	const receiver = createBroadcastReceiver({
		start: () => {
			remotes.store.start.fire();
		},
	});

	remotes.store.dispatch.connect((actions) => {
		receiver.dispatch(actions);
	});

	remotes.store.hydrate.connect((state) => {
		receiver.hydrate(state);
	});

	return receiver.middleware;
}
