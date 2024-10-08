import React from "@rbxts/react";
import { Text } from "client/components/ui/text";
import { fonts } from "client/constants/fonts";
import { useRem } from "client/hooks";
import { IS_PROD } from "shared/constants/core";
import { palette } from "shared/constants/palette";

interface HomeVersionProps {
	readonly position: UDim2;
}

const DIVIDER = `  <font transparency="0.75">—</font>  `;
const REPO = "littensy/slither";
const MODE = IS_PROD ? "production" : "development";

export function HomeVersion({ position }: HomeVersionProps) {
	const rem = useRem();

	return (
		<Text
			richText
			font={fonts.inter.medium}
			text={REPO + DIVIDER + MODE}
			textSize={rem(1.25)}
			textColor={palette.text}
			textTransparency={0.5}
			textXAlignment="Center"
			textYAlignment="Top"
			position={position}
		/>
	);
}
