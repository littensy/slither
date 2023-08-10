import Roact from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";

interface MinimapTracerProps {
	readonly from: Vector2;
	readonly to: Vector2;
}

export function MinimapTracer({ from, to }: MinimapTracerProps) {
	const center = from.add(to).div(2);
	const length = to.sub(from).Magnitude;

	const position = UDim2.fromScale(center.X, center.Y);
	const size = UDim2.fromScale(length, 0.25);
	const rotation = math.deg(math.atan2(to.Y - from.Y, to.X - from.X));

	return (
		<Image
			image={images.ui.circle}
			imageColor={palette.lavender}
			scaleType="Slice"
			sliceCenter={new Rect(256, 256, 256, 256)}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={size}
			position={position}
			rotation={rotation}
		/>
	);
}
