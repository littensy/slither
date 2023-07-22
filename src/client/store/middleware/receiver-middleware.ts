import { createBroadcastReceiver } from "@rbxts/reflex";
import { remotes } from "shared/remotes";

export function receiverMiddleware() {
	const dispatchers = [remotes.store.dispatch1, remotes.store.dispatch2, remotes.store.dispatch3];

	const receiver = createBroadcastReceiver({
		start: () => {
			remotes.store.start.fire();
		},
	});

	for (const dispatch of dispatchers) {
		dispatch.connect((actions) => {
			receiver.dispatch(actions);
		});
	}

	return receiver.middleware;
}
