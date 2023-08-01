import { defaultSnakeSkins } from "shared/data/skins";
import { PlayerSave } from "./save-slice";

export const defaultPlayerSave: PlayerSave = {
	balance: 0,
	skins: defaultSnakeSkins.map((skin) => skin.id),
};
