import { createProducer } from "@rbxts/reflex";
import { mapObject } from "shared/utils/object-utils";

export interface SaveState {
	readonly [id: string]: PlayerSave | undefined;
}

export interface PlayerSave {
	readonly balance: number;
}

const initialState: SaveState = {};

export const saveSlice = createProducer(initialState, {
	setPlayerSave: (state, player: string, save: PlayerSave) => ({
		...state,
		[player]: save,
	}),

	deletePlayerSave: (state, player: string) => ({
		...state,
		[player]: undefined,
	}),

	patchPlayerSave: (state, player: string, patch: Partial<PlayerSave>) => {
		return mapObject(state, (save, key) => {
			if (key !== player) {
				return save;
			}

			return {
				...save,
				...patch,
			};
		});
	},
});
