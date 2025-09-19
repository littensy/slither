import React, { useEffect } from "@rbxts/react";
import { CanvasGroup } from "client/components/ui/canvas-group";
import { Image } from "client/components/ui/image";
import { useRem, useSpring } from "client/hooks";
import { SnakeSkin } from "shared/constants/skins";
import { fillArray } from "shared/utils/object-utils";

import { SNAKE_ANGLE_OFFSET } from "../../world/snakes";

interface SkinThumbnailProps {
	readonly skin: SnakeSkin;
	readonly active: boolean;
	readonly transparency: React.Binding<number>;
}

const TRACER_SIZE = 7;
const TRACER_POINTS = 5;
const TRACER_SQUISH = 0.4;

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

export function SkinThumbnail({ skin, active, transparency }: SkinThumbnailProps) {
	const rem = useRem();
	const [offset, offsetSpring] = useSpring(new UDim());

	useEffect(() => {
		offsetSpring.setGoal(active ? new UDim(0, rem(-0.5)) : new UDim(0, rem(2)));
	}, [active, rem]);

	return (
		<CanvasGroup
			backgroundTransparency={1}
			cornerRadius={new UDim(0, rem(2.5))}
			groupTransparency={transparency}
			size={new UDim2(1, 0, 1, 0)}
		>
			<uipadding PaddingTop={offset} PaddingRight={offset} />

			<Image
				image={skin.headTexture ?? skin.texture[0]}
				imageColor={skin.tint[0]}
				scaleType="Slice"
				sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
				sliceScale={4}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(TRACER_SIZE), 0, rem(TRACER_SIZE))}
				position={new UDim2(0.5, 0, 0.5, 0)}
				rotation={45}
			>
				<Image
					image={skin.eyeTextureRight}
					size={new UDim2(0.45, 0, 0.45, 0)}
					position={new UDim2(0.5, 0, 0.1, 0)}
				/>

				<Image
					image={skin.eyeTextureLeft}
					anchorPoint={new Vector2(1, 0)}
					size={new UDim2(0.45, 0, 0.45, 0)}
					position={new UDim2(0.5, 0, 0.1, 0)}
				/>
			</Image>

			{TRACERS.map(({ size, position, rotation }, index) => (
				<Image
					key={`tracer-${index}`}
					image={skin.texture[(index + 1) % skin.texture.size()]}
					imageColor={skin.tint[(index + 1) % skin.tint.size()]}
					scaleType="Slice"
					sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
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
