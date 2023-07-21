import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useContinuousAngle, useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { SnakeSkin, getSnakeTracerSkin } from "shared/data/skins";
import { subtractRadians } from "shared/utils/math-utils";
import { SNAKE_ANGLE_OFFSET } from "./constants";
import { useTracerStyle } from "./use-tracer-style";

interface SnakeHeadProps {
	readonly position: Vector2;
	readonly scale: number;
	readonly angle: number;
	readonly targetAngle: number;
	readonly size: number;
	readonly skin: SnakeSkin;
	readonly boost: boolean;
	readonly dead: boolean;
}

export function SnakeHead({ position, scale, angle, targetAngle, size, skin, boost, dead }: SnakeHeadProps) {
	const { texture, tint } = getSnakeTracerSkin(skin.id, 0);

	const rem = useRem();
	const currentAngle = useContinuousAngle(angle);
	const angleDifference = useContinuousAngle(subtractRadians(targetAngle, currentAngle));
	const style = useTracerStyle(boost, dead, tint, 0);

	const [smoothPosition, setSmoothPosition] = useMotor({
		x: position.X * scale,
		y: position.Y * scale,
	});
	const [smoothAngle, setSmoothAngle] = useMotor(currentAngle);
	const [smoothEyeAngle, setSmoothEyeAngle] = useMotor(0);

	useEffect(() => {
		setSmoothPosition({
			x: new Spring(position.X * scale),
			y: new Spring(position.Y * scale),
		});
		setSmoothAngle(new Spring(currentAngle + SNAKE_ANGLE_OFFSET));
		setSmoothEyeAngle(new Spring(angleDifference));
	}, [position, currentAngle, angleDifference, scale]);

	return (
		<Image
			image={texture}
			imageColor={style.color}
			imageTransparency={style.transparency}
			scaleType="Slice"
			sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
			sliceScale={4}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0, rem(size * scale), 0, rem(size * scale))}
			position={smoothPosition.map(({ x, y }) => new UDim2(0, rem(x), 0, rem(y)))}
			rotation={smoothAngle.map(math.deg)}
		>
			<Image
				key="eye-right"
				image={images.skins.snake_eye_right}
				imageTransparency={style.transparency}
				size={new UDim2(0.45, 0, 0.45, 0)}
				position={new UDim2(0.5, 0, 0.1, 0)}
				rotation={smoothEyeAngle.map(math.deg)}
			/>

			<Image
				key="eye-left"
				image={images.skins.snake_eye_left}
				imageTransparency={style.transparency}
				anchorPoint={new Vector2(1, 0)}
				size={new UDim2(0.45, 0, 0.45, 0)}
				position={new UDim2(0.5, 0, 0.1, 0)}
				rotation={smoothEyeAngle.map(math.deg)}
			/>
		</Image>
	);
}
