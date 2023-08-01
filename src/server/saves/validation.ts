import { t } from "@rbxts/t";
import { PlayerSave } from "shared/store/saves";

export const validateSave: t.check<PlayerSave> = t.strictInterface({
	balance: t.number,
	skins: t.array(t.string),
	skin: t.optional(t.string),
});
