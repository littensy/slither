import { spring } from "@rbxts/ripple";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useMotion, useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";

interface MinimapCursorProps {
	readonly point: Vector2;
	readonly rotation: number;
}

export function MinimapCursor({ point, rotation = 0 }: MinimapCursorProps) {
	const rem = useRem();
	const [smoothRotation, smoothRotationMotion] = useMotion(rotation);

	useEffect(() => {
		smoothRotationMotion.spring(rotation);
	}, [rotation]);

	return (
		<Image
			image={images.ui.map_cursor}
			imageColor={palette.text}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0, rem(28, "pixel"), 0, rem(28, "pixel"))}
			position={new UDim2(point.X, 0, point.Y, 0)}
			rotation={smoothRotation}
		/>
	);
}
