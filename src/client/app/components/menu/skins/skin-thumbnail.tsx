import Roact, { useEffect } from "@rbxts/roact";
import { CanvasGroup } from "client/app/common/canvas-group";
import { Image } from "client/app/common/image";
import { useMotion, useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { fillArray } from "shared/utils/object-utils";

import { SNAKE_ANGLE_OFFSET } from "../../world/snakes";

interface SkinThumbnailProps {
	readonly tints: readonly Color3[];
	readonly textures: readonly string[];
	readonly textureSize: Vector2;
	readonly active: boolean;
	readonly transparency: Roact.Binding<number>;
}

const TRACER_SIZE = 7;
const TRACER_POINTS = 6;
const TRACER_SQUISH = 0.3;

const TRACERS = fillArray(TRACER_POINTS, (index) => {
	const from = new Vector2(
		0.5 - (index + 1) / (TRACER_POINTS / TRACER_SQUISH),
		0.5 + (index + 1) / (TRACER_POINTS / TRACER_SQUISH),
	);

	const to = new Vector2(
		0.5 - index / (TRACER_POINTS / TRACER_SQUISH),
		0.5 + index / (TRACER_POINTS / TRACER_SQUISH),
	);

	const size = new Vector2(0, from.sub(to).Magnitude);
	const position = from.add(to).div(2);
	const rotation = math.deg(math.atan2(to.Y - from.Y, to.X - from.X) + SNAKE_ANGLE_OFFSET);

	return { size, position, rotation };
});

export function SkinThumbnail({ tints, textures, textureSize, active, transparency }: SkinThumbnailProps) {
	const rem = useRem();
	const [offset, offsetMotion] = useMotion(new UDim());

	useEffect(() => {
		offsetMotion.spring(active ? new UDim(0, rem(-0.5)) : new UDim(0, rem(2)));
	}, [active, rem]);

	return (
		<CanvasGroup
			backgroundTransparency={1}
			cornerRadius={new UDim(0, rem(2.5))}
			groupTransparency={transparency}
			size={new UDim2(1, 0, 1, 0)}
		>
			<uipadding key="offset" PaddingTop={offset} PaddingRight={offset} />

			<Image
				key="head"
				image={textures[0]}
				imageColor={tints[0]}
				scaleType="Slice"
				sliceCenter={new Rect(textureSize.div(2), textureSize.div(2))}
				sliceScale={4}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(TRACER_SIZE), 0, rem(TRACER_SIZE))}
				position={new UDim2(0.5, 0, 0.5, 0)}
				rotation={45}
			>
				<Image
					key="eye-right"
					image={images.skins.snake_eye_right}
					size={new UDim2(0.45, 0, 0.45, 0)}
					position={new UDim2(0.5, 0, 0.1, 0)}
				/>

				<Image
					key="eye-left"
					image={images.skins.snake_eye_left}
					anchorPoint={new Vector2(1, 0)}
					size={new UDim2(0.45, 0, 0.45, 0)}
					position={new UDim2(0.5, 0, 0.1, 0)}
				/>
			</Image>

			{TRACERS.map(({ size, position, rotation }, index) => (
				<Image
					key={`tracer-${index}`}
					image={textures[(index + 1) % textures.size()]}
					imageColor={tints[index % tints.size()]}
					scaleType="Slice"
					sliceCenter={new Rect(textureSize.div(2), textureSize.div(2))}
					sliceScale={4}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={new UDim2(size.X, rem(TRACER_SIZE), size.Y, rem(TRACER_SIZE))}
					position={new UDim2(position.X, 0, position.Y, 0)}
					rotation={rotation}
					zIndex={-index - 1}
				/>
			))}
		</CanvasGroup>
	);
}
