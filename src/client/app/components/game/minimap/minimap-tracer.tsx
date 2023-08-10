import Roact from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { useRem } from "client/app/hooks";
import { palette } from "shared/data/palette";

interface MinimapTracerProps {
	readonly from: Vector2;
	readonly to: Vector2;
}

export function MinimapTracer({ from, to }: MinimapTracerProps) {
	const rem = useRem();

	const center = from.add(to).div(2);
	const length = from.sub(to).Magnitude;

	const position = new UDim2(center.X, 0, center.Y, 0);
	const size = new UDim2(length, rem(0.2), 0, rem(0.2));
	const rotation = math.deg(math.atan2(to.Y - from.Y, to.X - from.X));

	return (
		<Frame
			backgroundColor={palette.lavender}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={size}
			position={position}
			rotation={rotation}
		/>
	);
}
