import { createProducer } from "@rbxts/reflex";
import { mapProperty } from "shared/utils/object-utils";

import { PlayerSave } from "./save-types";

export interface SaveState {
	readonly [id: string]: PlayerSave | undefined;
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
		return mapProperty(state, player, (save) => ({
			...save,
			...patch,
		}));
	},

	givePlayerBalance: (state, player: string, amount: number) => {
		return mapProperty(state, player, (save) => ({
			...save,
			balance: math.max(save.balance + amount, 0),
		}));
	},

	givePlayerSkin: (state, player: string, skin: string) => {
		return mapProperty(state, player, (save) => ({
			...save,
			skins: [...save.skins, skin],
		}));
	},

	setPlayerSkin: (state, player: string, skin: string) => {
		return mapProperty(state, player, (save) => ({
			...save,
			skin,
		}));
	},
});
