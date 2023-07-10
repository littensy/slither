import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { useContinuousAngle, useRem } from "client/app/hooks";
import { SNAKE_ANGLE_OFFSET } from "./constants";

interface SnakeSegmentProps {
	readonly position: Vector2;
	readonly angle: number;
	readonly size: number;
	readonly index: number;
}

export function SnakeSegment({ position, angle, size, index }: SnakeSegmentProps) {
	const rem = useRem();
	const continuousAngle = useContinuousAngle(angle);
	const [smoothPosition, setSmoothPosition] = useMotor({ x: position.X, y: position.Y });
	const [smoothAngle, setSmoothAngle] = useMotor(continuousAngle);

	useEffect(() => {
		setSmoothPosition({
			x: new Spring(position.X),
			y: new Spring(position.Y),
		});
		setSmoothAngle(new Spring(continuousAngle + SNAKE_ANGLE_OFFSET));
	}, [position, continuousAngle]);

	return (
		<Frame
			size={new UDim2(0, size * rem, 0, size * rem)}
			position={smoothPosition.map(({ x, y }) => new UDim2(0, x * rem, 0, y * rem))}
			rotation={smoothAngle.map(math.deg)}
			anchorPoint={new Vector2(0.5, 0.5)}
			cornerRadius={new UDim(1, 0)}
			backgroundColor={Color3.fromRGB(51, 130, 97).Lerp(Color3.fromRGB(0, 0, 0), (index + 1) / 20)}
			zIndex={-index}
		/>
	);
}
