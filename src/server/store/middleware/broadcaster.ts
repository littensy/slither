import { createBroadcaster, ProducerMiddleware } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { IS_EDIT, WORLD_TICK } from "shared/constants";
import { remotes } from "shared/remotes";
import { serializeState, SharedStateSerialized } from "shared/serdes";
import { SharedState, slices } from "shared/store";

export function broadcasterMiddleware(): ProducerMiddleware {
	if (IS_EDIT) {
		return () => (dispatch) => dispatch;
	}

	const hydrated = new Set<number>();

	const broadcaster = createBroadcaster({
		producers: slices,
		dispatchRate: WORLD_TICK,
		hydrateRate: 60,
		dispatch: (player, actions) => {
			remotes.store.dispatch.fire(player, actions);
		},
		hydrate: (player, state) => {
			remotes.store.hydrate.fire(player, state as unknown as SharedStateSerialized);
		},
		beforeHydrate: (player, state) => {
			const isInitialHydrate = !hydrated.has(player.UserId);
			const serialized = serializeState(state, isInitialHydrate) as unknown as SharedState;

			if (isInitialHydrate) {
				hydrated.add(player.UserId);
				return serialized;
			}

			// exclude candy to reduce network traffic
			return {
				...serialized,
				candy: undefined,
			};
		},
	});

	remotes.store.start.connect((player) => {
		broadcaster.start(player);
	});

	Players.PlayerRemoving.Connect((player) => {
		hydrated.delete(player.UserId);
	});

	return broadcaster.middleware;
}
