import { BroadcastAction, createBroadcaster } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { WORLD_TICK } from "shared/constants";
import { remotes } from "shared/remotes";
import { slices } from "shared/store";
import { createScheduler } from "shared/utils/scheduler";

export function broadcasterMiddleware() {
	const hydrated = new Set<number>();
	const queue = new Map<number, BroadcastAction[]>();

	const broadcaster = createBroadcaster({
		producers: slices,
		hydrateRate: 120,
		dispatch: (player, actions) => {
			const queued = queue.get(player.UserId);

			if (queued) {
				for (const action of actions) {
					queued.push(action);
				}
			} else {
				queue.set(player.UserId, actions);
			}
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

	createScheduler({
		name: "broadcaster",
		interval: WORLD_TICK,
		onTick: () => {
			for (const [id, actions] of queue) {
				const player = Players.GetPlayerByUserId(id);

				if (player) {
					remotes.store.dispatch.fire(player, actions);
				}
			}

			queue.clear();
		},
	});

	return broadcaster.middleware;
}
