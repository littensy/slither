import { defaultSnakeSkins } from "shared/data/skins";
import { PlayerSave } from "./save-slice";

export const RANDOM_SKIN = "__random__";

export const defaultPlayerSave: PlayerSave = {
	balance: 0,
	skins: [RANDOM_SKIN, ...defaultSnakeSkins.map((skin) => skin.id)],
	skin: RANDOM_SKIN,
};
