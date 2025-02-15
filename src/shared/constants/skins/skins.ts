import { images } from "shared/assets";
import { darken } from "shared/utils/color-utils";

import { accentList, accents, palette } from "../palette";
import { defaultSnakeSkin, SnakeSkin } from "./types";
import { blendColorSequence, duplicate } from "./utils";

const catppuccinSnakeSkins: readonly SnakeSkin[] = accentList.map((id) => {
	return {
		...defaultSnakeSkin,
		id,
		tint: blendColorSequence([accents[id], accents[id].Lerp(palette.black, 0.1)], 12),
	};
});

export const snakeSkins: readonly SnakeSkin[] = [
	...catppuccinSnakeSkins,

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
		tint: [
			palette.blue,
			palette.blue,
			palette.offwhite,
			palette.offwhite,
			palette.red,
			palette.red,
			palette.offwhite,
			palette.offwhite,
		],
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
		id: "south-korea",
		price: 100,
		tint: [palette.offwhite, palette.offwhite, palette.blue, palette.red],
	},

	{
		...defaultSnakeSkin,
		id: "mexico",
		price: 100,
		tint: [palette.blue, palette.blue, palette.offwhite, palette.offwhite, palette.red, palette.red],
	},

	{
		...defaultSnakeSkin,
		id: "brazil",
		price: 100,
		tint: [palette.green, palette.green, palette.yellow, palette.yellow, palette.blue, palette.blue],
	},

	{
		...defaultSnakeSkin,
		id: "australia",
		price: 100,
		tint: [
			palette.blue,
			palette.blue,
			palette.blue,
			palette.white,
			palette.white,
			palette.offwhite,
			palette.red,
			palette.red,
			palette.offwhite,
		],
		texture: [
			images.skins.snake_main,
			images.skins.snake_main,
			images.skins.snake_main,
			images.skins.snake_stars,
			images.skins.snake_stars,
			images.skins.snake_main,
			images.skins.snake_main,
			images.skins.snake_main,
			images.skins.snake_main,
		],
	},

	{
		...defaultSnakeSkin,
		id: "estonia",
		price: 100,
		tint: [palette.blue, palette.blue, palette.surface1, palette.surface1, palette.offwhite, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "finland",
		price: 100,
		tint: [palette.offwhite, palette.offwhite, palette.offwhite, palette.blue],
	},

	{
		...defaultSnakeSkin,
		id: "norway",
		price: 100,
		tint: [palette.red, palette.red, palette.offwhite, palette.blue, palette.blue],
	},

	{
		...defaultSnakeSkin,
		id: "denmark",
		price: 100,
		tint: [palette.red, palette.red, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "sweden",
		price: 100,
		tint: [palette.blue, palette.blue, palette.yellow],
	},

	{
		...defaultSnakeSkin,
		id: "poland",
		price: 100,
		tint: [palette.offwhite, palette.offwhite, palette.red, palette.red],
	},

	{
		...defaultSnakeSkin,
		id: "czech",
		price: 100,
		tint: [
			palette.offwhite,
			palette.offwhite,
			palette.offwhite,
			palette.blue,
			palette.blue,
			palette.red,
			palette.red,
			palette.red,
		],
	},

	{
		...defaultSnakeSkin,
		id: "ukraine",
		price: 100,
		tint: [palette.blue, palette.blue, palette.blue, palette.yellow, palette.yellow, palette.yellow],
	},

	{
		...defaultSnakeSkin,
		id: "hungary",
		price: 100,
		tint: [palette.red, palette.red, palette.offwhite, palette.offwhite, palette.green, palette.green],
	},

	{
		...defaultSnakeSkin,
		id: "south-africa",
		price: 100,
		tint: [
			palette.red,
			palette.red,
			palette.offwhite,
			palette.green,
			palette.green,
			palette.yellow,
			palette.crust,
			palette.crust,
			palette.yellow,
			palette.green,
			palette.green,
			palette.offwhite,
			palette.blue,
			palette.blue,
			palette.offwhite,
		],
	},

	{
		...defaultSnakeSkin,
		id: "pride",
		price: 100,
		tint: [
			Color3.fromHex("#ed5352"),
			Color3.fromHex("#ef8c3d"),
			Color3.fromHex("#f8c654"),
			Color3.fromHex("#7cb788"),
			Color3.fromHex("#4b98cb"),
			Color3.fromHex("#bc59be"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "bi-pride",
		price: 100,
		tint: [
			Color3.fromHex("#ea4689"),
			Color3.fromHex("#ea4689"),
			Color3.fromHex("#ea4689"),
			Color3.fromHex("#b08dfb"),
			Color3.fromHex("#3059bb"),
			Color3.fromHex("#3059bb"),
			Color3.fromHex("#3059bb"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "pan-pride",
		price: 100,
		tint: [
			Color3.fromHex("#ea4689"),
			Color3.fromHex("#ea4689"),
			Color3.fromHex("#f4c757"),
			Color3.fromHex("#f4c757"),
			Color3.fromHex("#60b4ea"),
			Color3.fromHex("#60b4ea"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "lesbian-pride",
		price: 100,
		tint: [
			Color3.fromHex("#e86366"),
			Color3.fromHex("#e58f3f"),
			Color3.fromHex("#e8ba64"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#d2a8cd"),
			Color3.fromHex("#b95bbd"),
			Color3.fromHex("#862b6b"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "ace-pride",
		price: 100,
		tint: [palette.base, Color3.fromHex("#bcb6ba"), Color3.fromHex("#fcfffe"), Color3.fromHex("#b95bbd")],
	},

	{
		...defaultSnakeSkin,
		id: "aro-pride",
		price: 100,
		tint: [
			Color3.fromHex("#78b88b"),
			Color3.fromHex("#a3dbb2"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#bcb6ba"),
			palette.base,
		],
	},

	{
		...defaultSnakeSkin,
		id: "agender-pride",
		price: 100,
		tint: [
			palette.base,
			Color3.fromHex("#bcb6ba"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#78b88b"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#bcb6ba"),
			palette.base,
		],
	},

	{
		...defaultSnakeSkin,
		id: "genderfluid-pride",
		price: 100,
		tint: [
			Color3.fromHex("#e88599"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#b95bbd"),
			palette.base,
			Color3.fromHex("#2c5bbb"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "genderqueer-pride",
		price: 100,
		tint: [
			Color3.fromHex("#b85cb9"),
			Color3.fromHex("#b85cb9"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#79b78a"),
			Color3.fromHex("#79b78a"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "trans-pride",
		price: 100,
		tint: [
			Color3.fromHex("#94c8e5"),
			Color3.fromHex("#f5cfc8"),
			Color3.fromHex("#fcfffe"),
			Color3.fromHex("#f5cfc8"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "nonbinary-pride",
		price: 100,
		tint: [Color3.fromHex("#f4c757"), Color3.fromHex("#fcfffe"), Color3.fromHex("#b95bbd"), palette.base],
	},

	{
		...defaultSnakeSkin,
		id: "intersex-pride",
		price: 100,
		tint: [
			Color3.fromHex("#f6c754"),
			Color3.fromHex("#f6c754"),
			Color3.fromHex("#f6c754"),
			Color3.fromHex("#b95bbd"),
		],
	},

	{
		...defaultSnakeSkin,
		id: "peppermint",
		price: 150,
		tint: [palette.red, palette.red, palette.offwhite, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "candycorn",
		price: 150,
		tint: [palette.yellow, palette.yellow, palette.peach, palette.peach, palette.offwhite],
	},

	{
		...defaultSnakeSkin,
		id: "zebra",
		price: 250,
		tint: [palette.overlay0, palette.text],
	},

	{
		...defaultSnakeSkin,
		id: "honeybee",
		price: 350,
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
		id: "stare",
		price: 750,
		tint: blendColorSequence([palette.white, darken(palette.white, 0.25)], 10),
		boostTint: [palette.yellow],
		texture: [images.skins.snake_stare_body],
		headTexture: images.skins.snake_stare_head,
		eyeTextureLeft: images.skins.snake_no_eye,
		eyeTextureRight: images.skins.snake_no_eye,
		primary: darken(palette.peach, 0.5, 0.5),
		secondary: darken(palette.peach, 0.7, 0.5),
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
			30,
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
		id: "black-ice",
		price: 2750,
		tint: [palette.white],
		boostTint: [palette.crust],
		texture: [images.skins.snake_black_ice],
		primary: palette.mantle,
		secondary: palette.crust,
	},

	{
		...defaultSnakeSkin,
		id: "neon",
		price: 3500,
		tint: blendColorSequence([Color3.fromRGB(186, 51, 84), Color3.fromRGB(94, 41, 153)], 16),
		texture: [images.skins.snake_outlined],
	},

	{
		...defaultSnakeSkin,
		id: "nightwish",
		price: 3750,
		tint: blendColorSequence([Color3.fromRGB(61, 199, 207), Color3.fromRGB(166, 61, 186), palette.base], 16),
		texture: [images.skins.snake_outlined],
	},

	{
		...defaultSnakeSkin,
		id: "epic",
		price: 7331,
		tint: [palette.white],
		boostTint: [Color3.fromRGB(224, 179, 89)],
		texture: [images.skins.snake_awesome_body],
		headTexture: images.skins.snake_awesome_head,
		eyeTextureLeft: images.skins.snake_no_eye,
		eyeTextureRight: images.skins.snake_no_eye,
		primary: palette.surface2,
		secondary: palette.surface0,
	},

	{
		...defaultSnakeSkin,
		id: "devious",
		price: 13337,
		tint: [palette.white],
		boostTint: [Color3.fromRGB(186, 51, 69)],
		texture: [images.skins.snake_vamp_body],
		headTexture: images.skins.snake_vamp_head,
		eyeTextureLeft: images.skins.snake_no_eye,
		eyeTextureRight: images.skins.snake_no_eye,
		primary: palette.mantle,
		secondary: palette.crust,
	},
];

export const baseSnakeSkins = snakeSkins.filter((skin) => {
	return skin.price === 0;
});
