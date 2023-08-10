import { createProducer } from "@rbxts/reflex";
import { mapProperty } from "shared/utils/object-utils";

export interface SaveState {
	readonly [id: string]: PlayerSave | undefined;
}

export interface PlayerSave {
	readonly balance: number;
	readonly skins: readonly string[];
	readonly skin: string;
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
		return mapProperty(state, player, (save) => {
			return { ...save, ...patch };
		});
	},

	givePlayerBalance: (state, player: string, amount: number) => {
		return mapProperty(state, player, (save) => {
			return { ...save, balance: math.max(save.balance + amount, 0) };
		});
	},

	givePlayerSkin: (state, player: string, skin: string) => {
		return mapProperty(state, player, (save) => {
			return { ...save, skins: [...save.skins, skin] };
		});
	},

	setPlayerSkin: (state, player: string, skin: string) => {
		return mapProperty(state, player, (save) => {
			return { ...save, skin };
		});
	},
});
