import { images } from "shared/assets";

import { accentList, accents, palette } from "../palette";
import { SnakeSkin } from "../skins";
import { defaultSnakeSkin } from "./types";
import { blendColorSequence, duplicateSequence } from "./utils";

export const baseSnakeSkins: readonly SnakeSkin[] = accentList.map((id) => {
	return { ...defaultSnakeSkin, id, tint: [accents[id]] };
});

export const snakeSkins: readonly SnakeSkin[] = [
	...baseSnakeSkins,

	{
		...defaultSnakeSkin,
		id: "silver",
		price: 75,
		tint: [palette.text],
	},

	{
		...defaultSnakeSkin,
		id: "usa",
		price: 100,
		tint: [...duplicateSequence([palette.red, palette.white], 4), ...duplicateSequence([palette.white], 8)],
		texture: [
			...duplicateSequence([images.skins.snake_main], 8),
			...duplicateSequence([images.skins.snake_stars], 8),
		],
		primary: Color3.fromRGB(59, 77, 138),
		secondary: Color3.fromRGB(43, 57, 105),
	},

	{
		...defaultSnakeSkin,
		id: "canada",
		price: 100,
		tint: [palette.red, palette.white, palette.offwhite, palette.offwhite],
		texture: [images.skins.snake_main, images.skins.snake_canada, images.skins.snake_main, images.skins.snake_main],
	},

	{
		...defaultSnakeSkin,
		id: "uk",
		price: 100,
		tint: [palette.blue, palette.red, palette.white],
	},

	{
		...defaultSnakeSkin,
		id: "france",
		price: 100,
		tint: [palette.blue, palette.white, palette.red],
	},

	{
		...defaultSnakeSkin,
		id: "germany",
		price: 100,
		tint: [palette.surface1, palette.red, palette.yellow],
	},

	{
		...defaultSnakeSkin,
		id: "estonia",
		price: 100,
		tint: [palette.blue, palette.surface1, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "peppermint",
		price: 125,
		tint: [palette.red, palette.red, palette.white, palette.white],
	},

	{
		...defaultSnakeSkin,
		id: "candycorn",
		price: 125,
		tint: [palette.yellow, palette.yellow, palette.peach, palette.peach, palette.white],
	},

	{
		...defaultSnakeSkin,
		id: "zebra",
		price: 150,
		tint: [palette.overlay0, palette.text],
	},

	{
		...defaultSnakeSkin,
		id: "honeybee",
		price: 175,
		tint: [palette.mantle, palette.mantle, palette.yellow],
	},

	{
		...defaultSnakeSkin,
		id: "space-cat",
		price: 175,
		tint: [palette.surface0, palette.offwhite, palette.mauve],
	},

	{
		...defaultSnakeSkin,
		id: "berries-and-cherries",
		price: 200,
		tint: blendColorSequence([palette.red, palette.mauve, palette.blue, palette.mauve], 16),
	},

	{
		...defaultSnakeSkin,
		id: "sunset",
		price: 200,
		tint: blendColorSequence([palette.mauve, palette.red, palette.peach, palette.red], 16),
	},

	{
		...defaultSnakeSkin,
		id: "siamese",
		price: 250,
		tint: blendColorSequence([Color3.fromRGB(99, 74, 61), palette.yellow], 16),
		primary: Color3.fromRGB(125, 94, 76),
		secondary: Color3.fromRGB(92, 69, 56),
	},

	{
		...defaultSnakeSkin,
		id: "jelly",
		price: 275,
		tint: blendColorSequence([palette.white, palette.offwhite], 6),
		texture: [images.skins.snake_jelly],
		primary: Color3.fromRGB(70, 140, 102),
		secondary: Color3.fromRGB(54, 117, 68),
	},

	{
		...defaultSnakeSkin,
		id: "rainbow",
		price: 300,
		tint: blendColorSequence(
			[
				palette.red,
				palette.peach,
				palette.yellow,
				palette.green,
				palette.teal,
				palette.sky,
				palette.sapphire,
				palette.blue,
				palette.mauve,
			],
			18,
		),
		primary: Color3.fromRGB(186, 51, 84),
		secondary: Color3.fromRGB(122, 51, 107),
	},

	{
		...defaultSnakeSkin,
		id: "neon",
		price: 500,
		tint: blendColorSequence([Color3.fromRGB(186, 51, 84), Color3.fromRGB(122, 51, 107)], 16),
		texture: [images.skins.snake_outlined],
		primary: palette.mantle,
		secondary: palette.crust,
	},
];
