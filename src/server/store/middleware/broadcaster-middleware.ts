import { createBroadcaster } from "@rbxts/reflex";
import { remotes } from "shared/remotes";
import { slices } from "shared/store";

export function broadcasterMiddleware() {
	const broadcaster = createBroadcaster({
		producers: slices,
		broadcast: (players, actions) => {
			remotes.store.dispatch.firePlayers(players, actions);
		},
	});

	remotes.store.state.onRequest((player) => {
		return broadcaster.playerRequestedState(player);
	});

	return broadcaster.middleware;
}
