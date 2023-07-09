import { BroadcastAction } from "@rbxts/reflex";
import { Client, Server, createRemotes, loggerMiddleware, namespace, remote } from "@rbxts/remo";
import { SharedState } from "./store";

export const remotes = createRemotes(
	{
		/**
		 * Remotes used for syncing server state with the client
		 */
		store: namespace({
			/**
			 * @param actions The actions to dispatch to the client
			 */
			dispatch: remote<Client, [actions: BroadcastAction[]]>(),
			/**
			 * @returns The current state of the store
			 */
			state: remote<Server>().returns<SharedState>(),
		}),
	},
	loggerMiddleware,
);
