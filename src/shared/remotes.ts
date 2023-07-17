import { BroadcastAction } from "@rbxts/reflex";
import { Client, Server, createRemotes, namespace, remote } from "@rbxts/remo";
import { t } from "@rbxts/t";

export const remotes = createRemotes({
	/**
	 * Sync server state with the client
	 */
	store: namespace({
		/**
		 * Dispatches server actions to the client
		 */
		dispatch: remote<Client, [actions: BroadcastAction[]]>(),
		/**
		 * Marks the player as ready to receive state
		 */
		start: remote<Server>(),
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
		 * Kills the player's own snake
		 */
		kill: remote<Server>(),
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
});
