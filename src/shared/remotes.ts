import { BroadcastAction } from "@rbxts/reflex";
import { Client, Server, createRemotes, loggerMiddleware, namespace, remote } from "@rbxts/remo";
import { t } from "@rbxts/t";
import { SharedState } from "./store";

export const remotes = createRemotes(
	{
		/**
		 * Sync server state with the client
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
		/**
		 * Inputs for snake characters
		 */
		snake: namespace({
			/**
			 * Spawns a new snake for the player
			 */
			spawn: remote<Server>(),
			/**
			 * Turns the snake to the given angle
			 * @param angle The direction to turn the snake
			 */
			move: remote<Server, [angle: number]>(t.number),
			/**
			 * Sets the boost state of the snake
			 * @param boost Whether to boost or not
			 */
			boost: remote<Server, [boost: boolean]>(t.boolean),
		}),
	},
	loggerMiddleware,
);
