import { createBroadcaster } from "@rbxts/reflex";
import { remotes } from "shared/remotes";
import { slices } from "shared/store";

export function broadcasterMiddleware() {
	const broadcaster = createBroadcaster({
		producers: slices,
		hydrateRate: 30,
		dispatch: (player, actions) => {
			remotes.store.dispatch.fire(player, actions);
		},
	});

	remotes.store.start.connect((player) => {
		broadcaster.start(player);
	});

	return broadcaster.middleware;
}
