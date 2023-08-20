import { accentList, accents } from "../palette";
import { SnakeSkin } from "../skins";
import { defaultSnakeSkin } from "./types";

export const baseSnakeSkins: readonly SnakeSkin[] = accentList.map((id) => {
	return { ...defaultSnakeSkin, id, tint: [accents[id]] };
});

export const snakeSkins: readonly SnakeSkin[] = [
	...baseSnakeSkins,

	{
		...defaultSnakeSkin,
		id: "rainbow",
		price: 45,
		tint: [
			accents.red,
			accents.peach,
			accents.yellow,
			accents.green,
			accents.teal,
			accents.sky,
			accents.sapphire,
			accents.blue,
			accents.lavender,
		],
		primary: Color3.fromRGB(186, 51, 84),
		secondary: Color3.fromRGB(122, 51, 107),
	},
];
