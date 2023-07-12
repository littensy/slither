/**
 * @see https://github.com/catppuccin/catppuccin
 */
export const accents = {
	rosewater: Color3.fromRGB(242, 213, 207),
	flamingo: Color3.fromRGB(238, 190, 190),
	pink: Color3.fromRGB(244, 184, 228),
	mauve: Color3.fromRGB(202, 158, 230),
	red: Color3.fromRGB(231, 130, 132),
	maroon: Color3.fromRGB(234, 153, 156),
	peach: Color3.fromRGB(239, 159, 118),
	yellow: Color3.fromRGB(229, 200, 144),
	green: Color3.fromRGB(166, 209, 137),
	teal: Color3.fromRGB(129, 200, 190),
	sky: Color3.fromRGB(153, 209, 219),
	sapphire: Color3.fromRGB(133, 193, 220),
	blue: Color3.fromRGB(140, 170, 238),
	lavender: Color3.fromRGB(186, 187, 241),
} as const;

/**
 * @see https://github.com/catppuccin/catppuccin
 */
export const neutrals = {
	text: Color3.fromRGB(198, 208, 245),
	subtext1: Color3.fromRGB(181, 191, 226),
	subtext0: Color3.fromRGB(165, 173, 206),
	overlay2: Color3.fromRGB(148, 156, 187),
	overlay1: Color3.fromRGB(131, 139, 167),
	overlay0: Color3.fromRGB(115, 121, 148),
	surface2: Color3.fromRGB(98, 104, 128),
	surface1: Color3.fromRGB(81, 87, 109),
	surface0: Color3.fromRGB(65, 69, 89),
	base: Color3.fromRGB(48, 52, 70),
	mantle: Color3.fromRGB(41, 44, 60),
	crust: Color3.fromRGB(35, 38, 52),
} as const;

/**
 * @see https://github.com/catppuccin/catppuccin
 */
export const palette = {
	...accents,
	...neutrals,
} as const;
