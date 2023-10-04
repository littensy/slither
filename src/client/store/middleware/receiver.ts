import { createBroadcastReceiver, ProducerMiddleware } from "@rbxts/reflex";
import { IS_EDIT } from "shared/constants/core";
import { remotes } from "shared/remotes";
import { deserializeState } from "shared/serdes";

export function receiverMiddleware(): ProducerMiddleware {
	if (IS_EDIT) {
		return () => (dispatch) => dispatch;
	}

	const receiver = createBroadcastReceiver({
		start: () => {
			remotes.store.start.fire();
		},
	});

	remotes.store.dispatch.connect((actions) => {
		receiver.dispatch(actions);
	});

	remotes.store.hydrate.connect((state) => {
		receiver.hydrate(deserializeState(state));
	});

	return receiver.middleware;
}
