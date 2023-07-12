import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { useContinuousAngle, useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { SnakeSkin, getSnakeSegmentSkin } from "shared/data/skins";
import { subtractRadians } from "shared/utils/math-utils";
import { SNAKE_ANGLE_OFFSET } from "./constants";
import { useSegmentColor } from "./use-segment-color";

interface SnakeHeadProps {
	readonly position: Vector2;
	readonly angle: number;
	readonly targetAngle: number;
	readonly size: number;
	readonly skin: SnakeSkin;
	readonly boost: boolean;
}

export function SnakeHead({ position, angle, targetAngle, size, skin, boost }: SnakeHeadProps) {
	const { texture, tint } = getSnakeSegmentSkin(skin.id, 0);
	const rem = useRem();
	const continuousAngle = useContinuousAngle(angle);
	const color = useSegmentColor(boost, tint, -1);
	const [smoothPosition, setSmoothPosition] = useMotor({ x: position.X, y: position.Y });
	const [smoothAngle, setSmoothAngle] = useMotor(continuousAngle);
	const [smoothEyeAngle, setSmoothEyeAngle] = useMotor(0);

	useEffect(() => {
		setSmoothPosition({
			x: new Spring(position.X),
			y: new Spring(position.Y),
		});
		setSmoothAngle(new Spring(continuousAngle + SNAKE_ANGLE_OFFSET));
		setSmoothEyeAngle(new Spring(subtractRadians(targetAngle, continuousAngle)));
	}, [position, continuousAngle, targetAngle]);

	return (
		<Image
			image={texture}
			imageColor={color}
			scaleType="Slice"
			sliceCenter={new Rect(skin.size.div(2), skin.size.div(2))}
			sliceScale={4}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0, size * rem, 0, size * rem)}
			position={smoothPosition.map(({ x, y }) => new UDim2(0, x * rem, 0, y * rem))}
			rotation={smoothAngle.map(math.deg)}
		>
			<Image
				key="eye-right"
				image={images.skins.snake_eye_right}
				size={new UDim2(0.4, 0, 0.4, 0)}
				position={new UDim2(0.5, 0, 0.1, 0)}
				rotation={smoothEyeAngle.map(math.deg)}
			/>

			<Image
				key="eye-left"
				image={images.skins.snake_eye_left}
				anchorPoint={new Vector2(1, 0)}
				size={new UDim2(0.4, 0, 0.4, 0)}
				position={new UDim2(0.5, 0, 0.1, 0)}
				rotation={smoothEyeAngle.map(math.deg)}
			/>
		</Image>
	);
}
