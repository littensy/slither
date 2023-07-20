import { map } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { WORLD_BOUNDS } from "shared/constants";
import { palette } from "shared/data/palette";

interface MinimapNodeProps {
	readonly point: Vector2;
	readonly isClient?: boolean;
}

export function MinimapNode({ point, isClient = false }: MinimapNodeProps) {
	const rem = useRem();

	const position = UDim2.fromScale(
		map(point.X, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
		map(point.Y, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
	);

	return (
		<Image
			image={images.ui.circle}
			imageColor={isClient ? palette.text : palette.lavender}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={isClient ? new UDim2(0, rem(0.75), 0, rem(0.75)) : new UDim2(0, rem(0.5), 0, rem(0.5))}
			position={position}
		/>
	);
}
