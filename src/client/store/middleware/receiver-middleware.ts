import { createBroadcastReceiver } from "@rbxts/reflex";
import { remotes } from "shared/remotes";

export function receiverMiddleware() {
	const receiver = createBroadcastReceiver({
		requestState: () => remotes.store.state(),
	});

	remotes.store.dispatch.connect((actions) => {
		receiver.dispatch(actions);
	});

	return receiver.middleware;
}
