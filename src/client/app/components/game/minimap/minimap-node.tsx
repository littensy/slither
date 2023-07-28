import { Spring, map, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { WORLD_BOUNDS } from "shared/constants";
import { palette } from "shared/data/palette";

interface MinimapNodeProps {
	readonly point: Vector2;
	readonly rotation?: number;
	readonly isClient?: boolean;
}

export function MinimapNode({ point, rotation = 0, isClient = false }: MinimapNodeProps) {
	const rem = useRem();
	const [smoothPoint, setSmoothPoint] = useMotor({ x: point.X, y: point.Y });
	const [smoothRotation, setSmoothRotation] = useMotor(rotation);

	const position = smoothPoint.map((point) => {
		return UDim2.fromScale(
			map(point.x, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
			map(point.y, -WORLD_BOUNDS, WORLD_BOUNDS, 0, 1),
		);
	});

	useEffect(() => {
		setSmoothPoint({
			x: new Spring(point.X, { frequency: 2 }),
			y: new Spring(point.Y, { frequency: 2 }),
		});

		setSmoothRotation(new Spring(rotation, { frequency: 2 }));
	}, [point, rotation]);

	return (
		<Image
			image={isClient ? images.ui.map_cursor : images.ui.circle}
			imageColor={isClient ? palette.text : palette.lavender}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={
				isClient
					? new UDim2(0, rem(28, "relative"), 0, rem(28, "relative"))
					: new UDim2(0, rem(0.25), 0, rem(0.25))
			}
			rotation={smoothRotation}
			position={position}
		/>
	);
}
