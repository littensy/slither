import { lerp } from "@rbxts/pretty-react-hooks";

export function brighten(color: Color3, amount: number) {
	const [h, s, v] = color.ToHSV();

	return Color3.fromHSV(h, lerp(s, 1, -0.1 * amount), lerp(v, 1, 0.7 * amount));
}

export function darken(color: Color3, amount: number) {
	const [h, s, v] = color.ToHSV();

	return Color3.fromHSV(h, lerp(s, 0, 0.1 * amount), lerp(v, 0, -0.7 * amount));
}
