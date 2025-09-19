import React, { useEffect } from "@rbxts/react";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { Image } from "client/components/ui/image";
import { springs } from "client/constants/springs";
import { useRem, useSpring } from "client/hooks";
import { images } from "shared/assets";
import { USER_NAME } from "shared/constants/core";
import { palette } from "shared/constants/palette";
import { selectPlayerEquippedSkin, selectPlayerOwnsSkin } from "shared/store/saves";
import { brighten } from "shared/utils/color-utils";

interface SkinIndicatorProps {
	readonly id: string;
	readonly primary: Color3;
	readonly transparency: React.Binding<number>;
}

export function SkinIndicator({ id, primary, transparency }: SkinIndicatorProps) {
	const color = brighten(primary, 0.6);

	const rem = useRem();
	const owned = useSelectorCreator(selectPlayerOwnsSkin, USER_NAME, id);
	const equipped = useSelectorCreator(selectPlayerEquippedSkin, USER_NAME, id);

	const [indicator, indicatorSpring] = useSpring(new UDim2());

	useEffect(() => {
		const padding = rem(12, "pixel") + 4; // 6px - 2px

		indicatorSpring.setGoal(
			equipped ? new UDim2(0, rem(2) - padding, 0, rem(2) - padding) : new UDim2(),
			springs.gentle,
		);
	}, [equipped, rem]);

	return (
		<Image
			image={owned ? images.ui.skin_indicator : images.ui.skin_indicator_locked}
			imageColor={color}
			imageTransparency={transparency}
			anchorPoint={new Vector2(1, 0)}
			size={new UDim2(0, rem(2), 0, rem(2))}
			position={new UDim2(1, -rem(1), 0, rem(1))}
		>
			<Image
				image={images.ui.circle}
				imageColor={palette.offwhite}
				imageTransparency={transparency}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={indicator}
				position={new UDim2(0.5, 0, 0.5, 0)}
			/>
		</Image>
	);
}
