import { useMemo } from "@rbxts/roact";

export type FontFamily = "FredokaOne";

/**
 * Returns a memoized Font object from a font family, font style, and font weight.
 * @param font The font family to use.
 * @param fontWeight The font weight to use.
 * @param fontStyle The font style to use.
 * @returns A Font object.
 */
export function useFontFace(
	font: FontFamily = "FredokaOne",
	fontWeight: Enum.FontWeight = Enum.FontWeight.Regular,
	fontStyle: Enum.FontStyle = Enum.FontStyle.Normal,
) {
	return useMemo(() => {
		return Font.fromName(font, fontWeight, fontStyle);
	}, [font, fontStyle, fontWeight]);
}
