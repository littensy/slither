import { createBroadcaster } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { WORLD_TICK } from "shared/constants";
import { remotes } from "shared/remotes";
import { slices } from "shared/store";

export function broadcasterMiddleware() {
	const hydrated = new Set<number>();

	const broadcaster = createBroadcaster({
		producers: slices,
		dispatchRate: WORLD_TICK,
		hydrateRate: 30,
		dispatch: (player, actions) => {
			remotes.store.dispatch.fire(player, actions);
		},
		hydrate: (player, state) => {
			remotes.store.hydrate.fire(player, state);
		},
		beforeHydrate: (player, state) => {
			if (!hydrated.has(player.UserId)) {
				hydrated.add(player.UserId);
				return state;
			}

			// exclude candy to reduce network traffic
			return { ...state, candy: undefined };
		},
	});

	remotes.store.start.connect(async (player) => {
		broadcaster.start(player);
	});

	Players.PlayerRemoving.Connect((player) => {
		hydrated.delete(player.UserId);
	});

	return broadcaster.middleware;
}
