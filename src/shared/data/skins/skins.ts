import { accentList, accents, palette } from "../palette";
import { SnakeSkin } from "../skins";
import { defaultSnakeSkin } from "./types";
import { blendColorSequence } from "./utils";

export const baseSnakeSkins: readonly SnakeSkin[] = accentList.map((id) => {
	return { ...defaultSnakeSkin, id, tint: [accents[id]] };
});

export const snakeSkins: readonly SnakeSkin[] = [
	...baseSnakeSkins,

	{
		...defaultSnakeSkin,
		id: "peppermint",
		price: 125,
		tint: [palette.red, palette.red, palette.white, palette.white],
	},

	{
		...defaultSnakeSkin,
		id: "japan",
		price: 125,
		tint: [palette.white, palette.white, palette.red],
	},

	{
		...defaultSnakeSkin,
		id: "honeybee",
		price: 150,
		tint: [palette.mantle, palette.mantle, palette.yellow],
	},

	{
		...defaultSnakeSkin,
		id: "conspiracy",
		price: 175,
		tint: blendColorSequence([palette.mantle, palette.mantle, palette.yellow], 8, false),
	},

	{
		...defaultSnakeSkin,
		id: "candycorn",
		price: 150,
		tint: [palette.peach, palette.peach, palette.yellow, palette.yellow, palette.white],
	},

	{
		...defaultSnakeSkin,
		id: "berries-and-cherries",
		price: 250,
		tint: blendColorSequence([palette.red, palette.blue], 8, true),
	},

	{
		...defaultSnakeSkin,
		id: "hot-cocoa",
		price: 250,
		tint: blendColorSequence([Color3.fromRGB(99, 74, 61), Color3.fromRGB(59, 44, 36)], 8, true),
		primary: Color3.fromRGB(125, 94, 76),
		secondary: Color3.fromRGB(92, 69, 56),
	},

	{
		...defaultSnakeSkin,
		id: "rainbow",
		price: 300,
		tint: blendColorSequence(
			[
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
			16,
		),
		primary: Color3.fromRGB(186, 51, 84),
		secondary: Color3.fromRGB(122, 51, 107),
	},
];
