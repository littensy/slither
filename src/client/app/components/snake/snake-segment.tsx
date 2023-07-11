import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { joinBindings, useEffect, useMemo } from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { useRem } from "client/app/hooks";
import { SNAKE_ANGLE_OFFSET } from "./constants";

interface SnakeSegmentProps {
	readonly from: Vector2;
	readonly to: Vector2;
	readonly size: number;
	readonly index: number;
}

export function SnakeSegment({ from, to, size, index }: SnakeSegmentProps) {
	const rem = useRem();
	const [smoothFrom, setSmoothFrom] = useMotor({ x: from.X, y: from.Y });
	const [smoothTo, setSmoothTo] = useMotor({ x: to.X, y: to.Y });

	const { length, position, angle } = useMemo(() => {
		const binding = joinBindings([smoothFrom, smoothTo]);

		const length = binding.map(([from, to]) => {
			return new Vector2(from.x - to.x, from.y - to.y).Magnitude;
		});

		const position = binding.map(([from, to]) => {
			return new Vector2((from.x + to.x) / 2, (from.y + to.y) / 2);
		});

		const angle = binding.map(([from, to]) => {
			return math.atan2(to.y - from.y, to.x - from.x) + SNAKE_ANGLE_OFFSET;
		});

		return { length, position, angle };
	}, []);

	useEffect(() => {
		setSmoothFrom({ x: new Spring(from.X), y: new Spring(from.Y) });
		setSmoothTo({ x: new Spring(to.X), y: new Spring(to.Y) });
	}, [from, to]);

	return (
		<Frame
			size={length.map((length) => new UDim2(0, size * rem, 0, size * rem + length * rem))}
			position={position.map((position) => new UDim2(0, position.X * rem, 0, position.Y * rem))}
			rotation={angle.map(math.deg)}
			anchorPoint={new Vector2(0.5, 0.5)}
			cornerRadius={new UDim(1, 0)}
			backgroundColor={Color3.fromRGB(51, 130, 97).Lerp(Color3.fromRGB(0, 0, 0), (index + 1) / 20)}
			zIndex={-index}
		/>
	);
}
