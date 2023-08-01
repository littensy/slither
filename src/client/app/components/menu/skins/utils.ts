import { darken } from "client/app/utils/color-utils";
import { getSnakeSkin } from "shared/data/skins";

export const RANDOM_SKIN = "__random__";

export function getPalette(id: string) {
	const skin = getSnakeSkin(id);

	return {
		primary: skin.primary || darken(skin.tint[0], 0.5),
		secondary: skin.secondary || darken(skin.tint[0], 0.7),
		tint: skin.tint,
	};
}
