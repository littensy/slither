import { map } from "@rbxts/pretty-react-hooks";
import { spring } from "@rbxts/ripple";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useMotion, useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { WORLD_BOUNDS } from "shared/constants";
import { palette } from "shared/data/palette";

interface MinimapCursorProps {
	readonly point: Vector2;
	readonly rotation: number;
}

export function MinimapCursor({ point, rotation = 0 }: MinimapCursorProps) {
	const rem = useRem();
	const [smoothPoint, smoothPointMotion] = useMotion(point);
	const [smoothRotation, smoothRotationMotion] = useMotion(rotation);

	const position = smoothPoint.map((point) => {
		return UDim2.fromScale(
			map(point.X, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
			map(point.Y, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
		);
	});

	useEffect(() => {
		smoothPointMotion.spring(point);
		smoothRotationMotion.spring(rotation);
	}, [point, rotation]);

	return (
		<Image
			image={images.ui.map_cursor}
			imageColor={palette.text}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0, rem(28, "pixel"), 0, rem(28, "pixel"))}
			position={position}
			rotation={smoothRotation}
		/>
	);
}
