import { t } from "@rbxts/t";
import { baseSnakeSkins } from "shared/constants/skins";

export interface PlayerSave {
	readonly balance: number;
	readonly skins: readonly string[];
	readonly skin: string;
}

export const RANDOM_SKIN = "__random__";

export const defaultPlayerSave: PlayerSave = {
	balance: 100,
	skins: [RANDOM_SKIN, ...baseSnakeSkins.map((skin) => skin.id)],
	skin: RANDOM_SKIN,
};

export const playerSaveSchema: t.check<PlayerSave> = t.interface({
	balance: t.number,
	skins: t.array(t.string),
	skin: t.string,
});
