import React, { useEffect, useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { CanvasGroup } from "client/components/ui/canvas-group";
import { Frame } from "client/components/ui/frame";
import { Group } from "client/components/ui/group";
import { Image } from "client/components/ui/image";
import { springs } from "client/constants/springs";
import { useRem, useSpring } from "client/hooks";
import { selectWorldCamera } from "client/store/world";
import { images } from "shared/assets";
import { WORLD_BOUNDS } from "shared/constants/core";
import { palette } from "shared/constants/palette";

export function WorldBorder() {
	const rem = useRem();
	const world = useSelector(selectWorldCamera);

	const [worldCamera, worldCameraSpring] = useSpring({
		x: -world.offset.X,
		y: -world.offset.Y,
		scale: world.scale,
	});

	// Render a world border by getting the direction from the world origin
	// and creating a rectangle WORLD_BOUNDS units away from the origin
	const { position, rotation } = useMemo(() => {
		const position = worldCamera.map(({ x, y, scale }) => {
			const offset = new Vector2(x, y);
			const direction = offset !== Vector2.zero ? offset.Unit : new Vector2(1, 0);
			const position = direction.mul(rem(WORLD_BOUNDS * scale)).sub(rem(offset.mul(scale)));
			return new UDim2(0.5, position.X, 0.5, position.Y);
		});

		const rotation = worldCamera.map(({ x, y }) => {
			const offset = new Vector2(x, y);
			const direction = offset !== Vector2.zero ? offset.Unit : new Vector2(1, 0);
			return math.deg(math.atan2(direction.Y, direction.X));
		});

		return { position, rotation };
	}, [rem]);

	useEffect(() => {
		worldCameraSpring.setGoal(
			{
				x: -world.offset.X,
				y: -world.offset.Y,
				scale: world.scale,
			},
			springs.world,
		);
	}, [world]);

	return (
		<Group
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0, rem(150), 0, rem(150))}
			position={position}
			rotation={rotation}
			zIndex={3}
		>
			<Frame
				backgroundColor={palette.red}
				backgroundTransparency={0.5}
				size={new UDim2(0.5, rem(-2), 1, 0)}
				position={new UDim2(0.5, rem(2), 0, 0)}
			>
				<uistroke Color={palette.red} Thickness={rem(2)} Transparency={0.5} />

				<CanvasGroup size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1}>
					<Image
						image={images.ui.tile_stripes}
						imageColor={palette.black}
						imageTransparency={0.75}
						scaleType="Tile"
						tileSize={new UDim2(0, rem(4), 0, rem(4))}
						anchorPoint={new Vector2(1, 0.5)}
						size={new UDim2(0, rem(256), 0, rem(512))}
						position={new UDim2(1, 0, 0.5, 0)}
						rotation={rotation.map((r) => -r)}
					/>
				</CanvasGroup>
			</Frame>
		</Group>
	);
}
