import Roact, { memo } from "@rbxts/roact";
import { Image } from "client/common/image";
import { images } from "shared/assets";
import { palette } from "shared/constants/palette";

import { useMinimapRem } from "./utils";

interface MinimapTracerProps {
	readonly from: Vector2;
	readonly to: Vector2;
	readonly isPlayer: boolean;
	readonly isFriend: boolean;
	readonly isLeader: boolean;
}

export const MinimapTracer = memo<MinimapTracerProps>(({ from, to, isPlayer, isFriend, isLeader }) => {
	const rem = useMinimapRem();
	const center = from.add(to).div(2);
	const length = from.sub(to).Magnitude;
	const color = isLeader
		? palette.yellow
		: isFriend
		? palette.sapphire
		: isPlayer
		? palette.lavender
		: palette.surface2;

	return (
		<Image
			image={images.ui.circle}
			imageColor={color}
			scaleType="Slice"
			sliceCenter={new Rect(128, 128, 128, 128)}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(length, rem(0.2), 0, rem(0.2))}
			position={new UDim2(center.X, 0, center.Y, 0)}
			rotation={math.deg(math.atan2(to.Y - from.Y, to.X - from.X))}
		/>
	);
});
