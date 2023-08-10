import { BroadcastAction } from "@rbxts/reflex";
import { Client, createRemotes, namespace, remote, Server, throttleMiddleware } from "@rbxts/remo";
import { t } from "@rbxts/t";

import { WORLD_TICK } from "./constants";
import { SharedState } from "./store";

export const remotes = createRemotes({
	store: namespace({
		dispatch: remote<Client, [actions: BroadcastAction[]]>(),
		hydrate: remote<Client, [state: SharedState]>(),
		start: remote<Server>(),
	}),

	snake: namespace({
		spawn: remote<Server>(),
		kill: remote<Server>(),
		move: remote<Server, [angle: number]>(t.numberConstrained(-math.pi, math.pi)),
		boost: remote<Server, [boost: boolean]>(t.boolean).middleware(
			throttleMiddleware({ throttle: WORLD_TICK, trailing: true }),
		),
	}),

	save: namespace({
		setSkin: remote<Server, [skin: string]>(t.string),
		buySkin: remote<Server, [skin: string]>(t.string),
	}),
});
