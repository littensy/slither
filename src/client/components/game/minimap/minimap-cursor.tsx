import React, { useEffect } from "@rbxts/react";
import { Image } from "client/components/ui/image";
import { useContinuousAngle, useMotion } from "client/hooks";
import { images } from "shared/assets";
import { palette } from "shared/constants/palette";

import { useMinimapRem } from "./utils";

interface MinimapCursorProps {
	readonly point: Vector2;
	readonly angle: number;
}

export function MinimapCursor({ point, angle }: MinimapCursorProps) {
	const rem = useMinimapRem();
	const rotation = math.deg(useContinuousAngle(angle));
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
