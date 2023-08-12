import { lerp } from "@rbxts/pretty-react-hooks";

export function brighten(color: Color3, amount: number, saturation = 0.1) {
	const [h, s, v] = color.ToHSV();

	return Color3.fromHSV(h, lerp(s, 0, saturation * amount), lerp(v, 1, 0.7 * amount));
}

export function darken(color: Color3, amount: number, saturation = 0.1) {
	const [h, s, v] = color.ToHSV();

	return Color3.fromHSV(h, lerp(s, 1, saturation * amount), lerp(v, 0, 0.7 * amount));
}

export function brightness(color: Color3) {
	const [r, g, b] = [color.R, color.G, color.B];

	return (r * 299 + g * 587 + b * 114) / 1000;
}

export function brightenIfDark(color: Color3) {
	const darkness = 1 - brightness(color);

	return darkness > 0.5 ? brighten(color, darkness, 0.5) : color;
}
