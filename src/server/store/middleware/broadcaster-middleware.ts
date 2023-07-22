import { createBroadcaster } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
import { remotes } from "shared/remotes";
import { slices } from "shared/store";

export function broadcasterMiddleware() {
	const hydrated = new Set<number>();
	const queue = [remotes.store.dispatch1, remotes.store.dispatch2, remotes.store.dispatch3];

	const broadcaster = createBroadcaster({
		producers: slices,
		hydrateRate: 120,
		dispatch: (player, actions) => {
			queue[0].fire(player, actions);
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

	remotes.store.start.connect((player) => {
		broadcaster.start(player);
	});

	Players.PlayerRemoving.Connect((player) => {
		hydrated.delete(player.UserId);
	});

	setInterval(() => {
		queue.push(queue.shift()!);
	}, 0);

	return broadcaster.middleware;
}
