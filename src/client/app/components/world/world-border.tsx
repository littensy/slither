import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { CanvasGroup } from "client/app/common/canvas-group";
import { Frame } from "client/app/common/frame";
import { Group } from "client/app/common/group";
import { Image } from "client/app/common/image";
import { useRem } from "client/app/hooks";
import { selectWorldCamera } from "client/store/world";
import { images } from "shared/assets";
import { WORLD_BOUNDS } from "shared/constants";
import { palette } from "shared/data/palette";

export function WorldBorder() {
	const rem = useRem();
	const world = useSelector(selectWorldCamera);

	const [smoothPosition, setSmoothPosition] = useMotor({
		x: -world.offset.X,
		y: -world.offset.Y,
		scale: world.scale,
	});

	// Render a world border by getting the direction from the world origin
	// and creating a rectangle WORLD_BOUNDS units away from the origin
	const { position, rotation } = useMemo(() => {
		const position = smoothPosition.map(({ x, y, scale }) => {
			const offset = new Vector2(x, y);
			const direction = offset !== Vector2.zero ? offset.Unit : new Vector2(1, 0);
			const position = direction.mul(rem(WORLD_BOUNDS * scale)).sub(rem(offset.mul(scale)));
			return new UDim2(0.5, position.X, 0.5, position.Y);
		});

		const rotation = smoothPosition.map(({ x, y }) => {
			const offset = new Vector2(x, y);
			const direction = offset !== Vector2.zero ? offset.Unit : new Vector2(1, 0);
			return math.deg(math.atan2(direction.Y, direction.X));
		});

		return { position, rotation };
	}, [rem]);

	useEffect(() => {
		setSmoothPosition({
			x: new Spring(-world.offset.X),
			y: new Spring(-world.offset.Y),
			scale: new Spring(world.scale),
		});
	}, [world]);

	return (
		<Group
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0, rem(150), 0, rem(150))}
			position={position}
			rotation={rotation}
			zIndex={3}
		>
			<uipadding PaddingLeft={new UDim(0, rem(2))} PaddingRight={new UDim(0, rem(2))} />

			<Frame
				backgroundColor={palette.red}
				backgroundTransparency={0.5}
				size={new UDim2(0.5, 0, 1, 0)}
				position={new UDim2(0.5, 0, 0, 0)}
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
