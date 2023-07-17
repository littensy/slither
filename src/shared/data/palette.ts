import Object from "@rbxts/object-utils";

/**
 * @see https://github.com/catppuccin/catppuccin
 */
export const accents = {
	rosewater: Color3.fromRGB(244, 219, 214),
	flamingo: Color3.fromRGB(240, 198, 198),
	pink: Color3.fromRGB(245, 189, 230),
	mauve: Color3.fromRGB(198, 160, 246),
	red: Color3.fromRGB(237, 135, 150),
	maroon: Color3.fromRGB(238, 153, 160),
	peach: Color3.fromRGB(245, 169, 127),
	yellow: Color3.fromRGB(238, 212, 159),
	green: Color3.fromRGB(166, 218, 149),
	teal: Color3.fromRGB(139, 213, 202),
	sky: Color3.fromRGB(145, 215, 227),
	sapphire: Color3.fromRGB(125, 196, 228),
	blue: Color3.fromRGB(138, 173, 244),
	lavender: Color3.fromRGB(183, 189, 248),
} as const;

/**
 * @see https://github.com/catppuccin/catppuccin
 */
export const neutrals = {
	text: Color3.fromRGB(202, 211, 245),
	subtext1: Color3.fromRGB(184, 192, 224),
	subtext0: Color3.fromRGB(165, 173, 203),
	overlay2: Color3.fromRGB(147, 154, 183),
	overlay1: Color3.fromRGB(128, 135, 162),
	overlay0: Color3.fromRGB(110, 115, 141),
	surface2: Color3.fromRGB(91, 96, 120),
	surface1: Color3.fromRGB(73, 77, 100),
	surface0: Color3.fromRGB(54, 58, 79),
	base: Color3.fromRGB(36, 39, 58),
	mantle: Color3.fromRGB(30, 32, 48),
	crust: Color3.fromRGB(24, 25, 38),
} as const;

const base = {
	white1: Color3.fromRGB(255, 255, 255),
	white0: Color3.fromRGB(234, 238, 253),
	black: Color3.fromRGB(0, 0, 0),
};

/**
 * @see https://github.com/catppuccin/catppuccin
 */
export const palette = {
	...accents,
	...neutrals,
	...base,
} as const;

export function getRandomAccent(): Color3 {
	const values = Object.values(accents);
	return values[math.random(0, values.size() - 1)];
}
