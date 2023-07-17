import { useMemo } from "@rbxts/roact";

export type FontFamily = keyof typeof fontIdsByName;

const fontIdsByName = {
	Inter: "rbxassetid://12187365364",
	Pacifico: "rbxassetid://12187367362",
};

/**
 * Returns a memoized Font object from a font family, font style, and font weight.
 * @param font The font family to use.
 * @param fontWeight The font weight to use.
 * @param fontStyle The font style to use.
 * @returns A Font object.
 */
export function useFontFace(
	font: FontFamily = "Inter",
	fontWeight: Enum.FontWeight = Enum.FontWeight.Regular,
	fontStyle: Enum.FontStyle = Enum.FontStyle.Normal,
) {
	return useMemo(() => {
		if (font in fontIdsByName) {
			return new Font(fontIdsByName[font], fontWeight, fontStyle);
		} else {
			return Font.fromName(font, fontWeight, fontStyle);
		}
	}, [font, fontStyle, fontWeight]);
}
