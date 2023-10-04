import { useInterval } from "@rbxts/pretty-react-hooks";
import { useState } from "@rbxts/roact";
import { getSnakeSkin, SnakeSkin } from "shared/constants/skins";
import { darken } from "shared/utils/color-utils";

export interface SnakePalette {
	readonly skin: SnakeSkin;
	readonly primary: Color3;
	readonly secondary: Color3;
}

export const DIRECTIONS = [-3, -2, -1, 0, 1, 2, 3];
export const DIRECTIONS_TO_HIDE = [-3, 3];

export function usePalette(id: string, shuffle?: readonly string[]): SnakePalette {
	const [skin, setSkin] = useState(getSnakeSkin(id));

	useInterval(() => {
		if (shuffle && !shuffle.isEmpty()) {
			const skinId = shuffle[math.random(0, shuffle.size() - 1)];
			setSkin(getSnakeSkin(skinId));
		}
	}, 1);

	return {
		skin,
		primary: skin.primary || darken(skin.tint[0], 0.5, 0.4),
		secondary: skin.secondary || darken(skin.tint[0], 0.7, 0.4),
	};
}
