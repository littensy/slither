import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useMotion, useRem } from "client/app/hooks";
import { brighten } from "client/app/utils/color-utils";
import { springs } from "client/app/utils/springs";
import { images } from "shared/assets";
import { LOCAL_USER } from "shared/constants";
import { palette } from "shared/data/palette";
import { selectPlayerEquippedSkin, selectPlayerOwnsSkin } from "shared/store/saves";

interface SkinIndicatorProps {
	readonly id: string;
	readonly primary: Color3;
	readonly transparency: Roact.Binding<number>;
}

export function SkinIndicator({ id, primary, transparency }: SkinIndicatorProps) {
	const color = brighten(primary, 0.6);

	const rem = useRem();
	const owned = useSelectorCreator(selectPlayerOwnsSkin, LOCAL_USER, id);
	const equipped = useSelectorCreator(selectPlayerEquippedSkin, LOCAL_USER, id);

	const [indicator, indicatorMotion] = useMotion(new UDim2());

	useEffect(() => {
		const padding = rem(12, "pixel") + 4; // 6px - 2px

		indicatorMotion.spring(
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
				key="indicator"
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
