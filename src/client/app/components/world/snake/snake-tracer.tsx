import { Spring, blend, lerpBinding, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { joinBindings, useEffect, useMemo } from "@rbxts/roact";
import { DelayRender } from "client/app/common/delay-render";
import { Image } from "client/app/common/image";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { SnakeSkin, getSnakeTracerSkin } from "shared/data/skins";
import { SNAKE_ANGLE_OFFSET } from "./constants";
import { useTracerStyle } from "./use-tracer-style";

interface SnakeTracerProps {
	readonly from: Vector2;
	readonly to: Vector2;
	readonly scale: number;
	readonly size: number;
	readonly index: number;
	readonly skin: SnakeSkin;
	readonly boost: boolean;
	readonly dead: boolean;
}

export function SnakeTracer({ from, to, scale, size, index, skin, boost, dead }: SnakeTracerProps) {
	const { texture, tint } = getSnakeTracerSkin(skin.id, index);

	const rem = useRem();
	const style = useTracerStyle(boost, dead, tint, index);

	const [glow, setGlow] = useMotor(0);
	const [line, setLine] = useMotor({
		fromX: from.X * scale,
		fromY: from.Y * scale,
		toX: to.X * scale,
		toY: to.Y * scale,
	});

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
			fromX: new Spring(from.X * scale),
			fromY: new Spring(from.Y * scale),
			toX: new Spring(to.X * scale),
			toY: new Spring(to.Y * scale),
		});
	}, [from, to, scale]);

	useEffect(() => {
		setGlow(new Spring(boost ? 1 : 0, { frequency: 2 }));
	}, [boost]);

	return (
		<Image
			image={texture}
			imageColor={style.color}
			imageTransparency={style.transparency}
			scaleType="Slice"
			sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
			sliceScale={4}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={length.map((length) => new UDim2(0, rem(size * scale), 0, rem(size * scale + length)))}
			position={position.map((position) => new UDim2(0, rem(position.X), 0, rem(position.Y)))}
			rotation={angle.map(math.deg)}
			zIndex={-index}
		>
			<DelayRender shouldRender={boost} unmountDelay={0.5}>
				<Image
					image={images.ui.blur}
					imageColor={style.color.map((color) => color.Lerp(new Color3(), 0.1))}
					imageTransparency={joinBindings([lerpBinding(glow, 1, 0), style.transparency]).map(([a, b]) =>
						blend(a, b),
					)}
					scaleType="Slice"
					sliceCenter={new Rect(256, 256, 256, 256)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={lerpBinding(glow, new UDim2(), new UDim2(1, rem(size * scale + 1), 1, rem(size * scale + 1)))}
					position={new UDim2(0.5, 0, 0.5, 0)}
				/>
			</DelayRender>
		</Image>
	);
}
