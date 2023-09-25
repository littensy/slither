import { images } from "shared/assets";

import { accentList, accents, palette } from "../palette";
import { SnakeSkin } from "../skins";
import { defaultSnakeSkin } from "./types";
import { blendColorSequence, duplicate } from "./utils";

export const baseSnakeSkins: readonly SnakeSkin[] = accentList.map((id) => {
	return {
		...defaultSnakeSkin,
		id,
		tint: blendColorSequence([accents[id], accents[id].Lerp(palette.black, 0.1)], 12),
	};
});

export const snakeSkins: readonly SnakeSkin[] = [
	...baseSnakeSkins,

	{
		...defaultSnakeSkin,
		id: "silver",
		price: 100,
		tint: [palette.text],
	},

	{
		...defaultSnakeSkin,
		id: "usa",
		price: 100,
		tint: [...duplicate([palette.red, palette.offwhite], 4), ...duplicate([palette.white], 8)],
		texture: [...duplicate([images.skins.snake_main], 8), ...duplicate([images.skins.snake_stars], 8)],
		boostTint: [...duplicate([palette.red, palette.offwhite], 4), ...duplicate([palette.blue], 8)],
		primary: Color3.fromRGB(59, 77, 138),
		secondary: Color3.fromRGB(43, 57, 105),
	},

	{
		...defaultSnakeSkin,
		id: "canada",
		price: 100,
		tint: [palette.red, palette.white, palette.offwhite],
		texture: [images.skins.snake_main, images.skins.snake_canada, images.skins.snake_main],
		boostTint: [palette.red, palette.red, palette.white],
	},

	{
		...defaultSnakeSkin,
		id: "uk",
		price: 100,
		tint: [palette.red, palette.red, palette.offwhite, palette.blue, palette.blue, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "france",
		price: 100,
		tint: [palette.blue, palette.blue, palette.offwhite, palette.offwhite, palette.red, palette.red],
	},

	{
		...defaultSnakeSkin,
		id: "germany",
		price: 100,
		tint: [palette.surface1, palette.surface1, palette.red, palette.red, palette.yellow, palette.yellow],
	},

	{
		...defaultSnakeSkin,
		id: "japan",
		price: 100,
		tint: [palette.offwhite, palette.offwhite, palette.red],
	},

	{
		...defaultSnakeSkin,
		id: "estonia",
		price: 100,
		tint: [palette.blue, palette.blue, palette.surface1, palette.surface1, palette.offwhite, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "peppermint",
		price: 200,
		tint: [palette.red, palette.red, palette.offwhite, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "candycorn",
		price: 250,
		tint: [palette.yellow, palette.yellow, palette.peach, palette.peach, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "zebra",
		price: 300,
		tint: [palette.overlay0, palette.text],
	},

	{
		...defaultSnakeSkin,
		id: "honeybee",
		price: 450,
		tint: [palette.mantle, palette.mantle, palette.yellow],
	},

	{
		...defaultSnakeSkin,
		id: "space-cat",
		price: 450,
		tint: [palette.surface0, palette.offwhite, palette.mauve],
	},

	{
		...defaultSnakeSkin,
		id: "berries-and-cherries",
		price: 750,
		tint: blendColorSequence([palette.red, palette.mauve, palette.blue, palette.mauve], 16),
	},

	{
		...defaultSnakeSkin,
		id: "sunset",
		price: 750,
		tint: blendColorSequence([palette.mauve, palette.red, palette.peach, palette.red], 16),
	},

	{
		...defaultSnakeSkin,
		id: "siamese",
		price: 750,
		tint: blendColorSequence([Color3.fromRGB(99, 74, 61), palette.yellow], 16),
		primary: Color3.fromRGB(125, 94, 76),
		secondary: Color3.fromRGB(92, 69, 56),
	},

	{
		...defaultSnakeSkin,
		id: "rainbow",
		price: 1000,
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
		secondary: Color3.fromRGB(217, 97, 125),
	},

	{
		...defaultSnakeSkin,
		id: "watermelon",
		price: 1500,
		tint: blendColorSequence([palette.white, Color3.fromRGB(97, 143, 122)], 12),
		boostTint: [Color3.fromRGB(97, 224, 148)],
		texture: [images.skins.snake_jelly],
		primary: Color3.fromRGB(70, 140, 102),
		secondary: Color3.fromRGB(54, 117, 68),
	},

	{
		...defaultSnakeSkin,
		id: "red-cherry",
		price: 1500,
		tint: blendColorSequence([palette.white, Color3.fromRGB(140, 97, 110)], 12),
		boostTint: [Color3.fromRGB(232, 107, 130)],
		texture: [images.skins.snake_jelly_red],
		primary: Color3.fromRGB(135, 48, 71),
		secondary: Color3.fromRGB(112, 38, 51),
	},

	{
		...defaultSnakeSkin,
		id: "blue-raspberry",
		price: 1500,
		tint: blendColorSequence([palette.white, Color3.fromRGB(97, 97, 140)], 12),
		boostTint: [Color3.fromRGB(97, 117, 219)],
		texture: [images.skins.snake_jelly_blue],
		primary: Color3.fromRGB(51, 64, 140),
		secondary: Color3.fromRGB(38, 38, 112),
	},

	{
		...defaultSnakeSkin,
		id: "neon",
		price: 2500,
		tint: blendColorSequence([Color3.fromRGB(186, 51, 84), Color3.fromRGB(94, 41, 153)], 16),
		texture: [images.skins.snake_outlined],
	},

	{
		...defaultSnakeSkin,
		id: "nightwish",
		price: 2750,
		tint: blendColorSequence([Color3.fromRGB(61, 199, 207), Color3.fromRGB(166, 61, 186), palette.base], 16),
		texture: [images.skins.snake_outlined],
	},

	{
		...defaultSnakeSkin,
		id: "black-ice",
		price: 3250,
		tint: [palette.white],
		boostTint: [palette.crust],
		texture: [images.skins.snake_black_ice],
		primary: palette.mantle,
		secondary: palette.crust,
	},
];
