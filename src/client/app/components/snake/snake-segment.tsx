import { Spring, lerpBinding, map, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { DelayRender } from "client/app/common/delay-render";
import { Image } from "client/app/common/image";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { SnakeSkin, getSnakeSegmentSkin } from "shared/data/skins";
import { SNAKE_ANGLE_OFFSET } from "./constants";
import { useSegmentColor } from "./use-segment-color";

interface SnakeSegmentProps {
	readonly from: Vector2;
	readonly to: Vector2;
	readonly size: number;
	readonly index: number;
	readonly skin: SnakeSkin;
	readonly boost: boolean;
}

export function SnakeSegment({ from, to, size, index, skin, boost }: SnakeSegmentProps) {
	const { texture, tint } = getSnakeSegmentSkin(skin.id, index);
	const rem = useRem();
	const color = useSegmentColor(boost, tint, index);
	const [glow, setGlow] = useMotor(0);
	const [line, setLine] = useMotor({ fromX: from.X, fromY: from.Y, toX: to.X, toY: to.Y });

	const { length, position, angle } = useMemo(() => {
		const length = line.map(({ fromX, fromY, toX, toY }) => {
			return new Vector2(fromX - toX, fromY - toY).Magnitude;
		});

		const position = line.map(({ fromX, fromY, toX, toY }) => {
			return new Vector2((fromX + toX) / 2, (fromY + toY) / 2);
		});

		const angle = line.map(({ fromX, fromY, toX, toY }) => {
			return math.atan2(toY - fromY, toX - fromX) + SNAKE_ANGLE_OFFSET;
		});

		return { length, position, angle };
	}, []);

	useEffect(() => {
		setLine({
			fromX: new Spring(from.X),
			fromY: new Spring(from.Y),
			toX: new Spring(to.X),
			toY: new Spring(to.Y),
		});
	}, [from, to]);

	useEffect(() => {
		setGlow(new Spring(boost ? 1 : 0, { frequency: 2 }));
	}, [boost]);

	return (
		<Image
			image={texture}
			imageColor={color}
			scaleType="Slice"
			sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
			sliceScale={4}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={length.map((length) => new UDim2(0, size * rem, 0, (size + length) * rem))}
			position={position.map((position) => new UDim2(0, position.X * rem, 0, position.Y * rem))}
			rotation={angle.map(math.deg)}
			zIndex={-index}
		>
			<DelayRender shouldRender={boost} unmountDelay={0.5}>
				<Image
					image={images.common.blur}
					imageColor={color.map((color) => color.Lerp(new Color3(), 0.1))}
					imageTransparency={lerpBinding(glow, 1, 0)}
					scaleType="Slice"
					sliceCenter={new Rect(256, 256, 256, 256)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={lerpBinding(glow, new UDim2(), new UDim2(1, (1 + size) * rem, 1, (1 + size) * rem))}
					position={new UDim2(0.5, 0, 0.5, 0)}
				/>
			</DelayRender>
		</Image>
	);
}
