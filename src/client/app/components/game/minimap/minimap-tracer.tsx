import Roact from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { palette } from "shared/data/palette";

import { useMinimapRem } from "./utils";

interface MinimapTracerProps {
	readonly from: Vector2;
	readonly to: Vector2;
}

export function MinimapTracer({ from, to }: MinimapTracerProps) {
	const rem = useMinimapRem();
	const center = from.add(to).div(2);
	const length = from.sub(to).Magnitude;

	return (
		<Frame
			backgroundColor={palette.lavender}
			cornerRadius={new UDim(1, 0)}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(length, rem(0.2), 0, rem(0.2))}
			position={new UDim2(center.X, 0, center.Y, 0)}
			rotation={math.deg(math.atan2(to.Y - from.Y, to.X - from.X))}
		/>
	);
}
