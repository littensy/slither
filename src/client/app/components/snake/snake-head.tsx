import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { useContinuousAngle, useRem } from "client/app/hooks";
import { subtractRadians } from "shared/utils/math-utils";
import { SNAKE_ANGLE_OFFSET } from "./constants";

interface SnakeHeadProps {
	readonly position: Vector2;
	readonly angle: number;
	readonly targetAngle: number;
	readonly size: number;
}

export function SnakeHead({ position, angle, targetAngle, size }: SnakeHeadProps) {
	const rem = useRem();
	const continuousAngle = useContinuousAngle(angle);
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
		<Frame
			size={new UDim2(0, size * rem, 0, size * rem)}
			position={smoothPosition.map(({ x, y }) => new UDim2(0, x * rem, 0, y * rem))}
			rotation={smoothAngle.map(math.deg)}
			anchorPoint={new Vector2(0.5, 0.5)}
			cornerRadius={new UDim(1, 0)}
			backgroundColor={Color3.fromRGB(51, 130, 97)}
		>
			<Frame
				key="eye-right"
				size={new UDim2(0.4, 0, 0.4, 0)}
				position={new UDim2(0.5, 0, 0.1, 0)}
				rotation={smoothEyeAngle.map(math.deg)}
				cornerRadius={new UDim(1, 0)}
				backgroundColor={Color3.fromRGB(255, 255, 255)}
			>
				<Frame
					key="pupil"
					anchorPoint={new Vector2(0.5, 0)}
					size={new UDim2(0.6, 0, 0.6, 0)}
					position={new UDim2(0.5, 0, 0, 0)}
					cornerRadius={new UDim(1, 0)}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
				/>
			</Frame>

			<Frame
				key="eye-left"
				anchorPoint={new Vector2(1, 0)}
				size={new UDim2(0.4, 0, 0.4, 0)}
				position={new UDim2(0.5, 0, 0.1, 0)}
				rotation={smoothEyeAngle.map(math.deg)}
				cornerRadius={new UDim(1, 0)}
				backgroundColor={Color3.fromRGB(255, 255, 255)}
			>
				<Frame
					key="pupil"
					anchorPoint={new Vector2(0.5, 0)}
					size={new UDim2(0.6, 0, 0.6, 0)}
					position={new UDim2(0.5, 0, 0, 0)}
					cornerRadius={new UDim(1, 0)}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
				/>
			</Frame>
		</Frame>
	);
}
