import { BroadcastAction } from "@rbxts/reflex";
import { Client, Server, createRemotes, namespace, remote, throttleMiddleware } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { WORLD_TICK } from "./constants";

export const remotes = createRemotes({
	store: namespace({
		dispatch1: remote<Client, [actions: BroadcastAction[]]>(),
		dispatch2: remote<Client, [actions: BroadcastAction[]]>(),
		dispatch3: remote<Client, [actions: BroadcastAction[]]>(),
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
});
