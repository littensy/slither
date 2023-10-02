const lerpAlpha = (a: number, b: number, t: number) => math.clamp(a + (b - a) * t, 0, 1);

export function brighten(color: Color3, amount: number, desaturation = 0.25 * amount) {
	const [h, s, v] = color.ToHSV();

	return Color3.fromHSV(h, lerpAlpha(s, 0, desaturation), lerpAlpha(v, 1, 0.7 * amount));
}

export function darken(color: Color3, amount: number, saturation = 0.25 * amount) {
	const [h, s, v] = color.ToHSV();

	return Color3.fromHSV(h, lerpAlpha(s, 1, saturation), lerpAlpha(v, 0, 0.7 * amount));
}

export function brightness(color: Color3) {
	const [r, g, b] = [color.R, color.G, color.B];

	return (r * 299 + g * 587 + b * 114) / 1000;
}

export function brightenIfDark(color: Color3) {
	const darkness = 1 - brightness(color);

	return darkness > 0.5 ? brighten(color, darkness, 0.5) : color;
}
