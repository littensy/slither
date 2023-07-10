import { useEventListener } from "@rbxts/pretty-react-hooks";
import Roact, { useBinding, useRef } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
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
	const smoothFrom = useRef(from);
	const smoothTo = useRef(to);

	const [smoothLength, setSmoothLength] = useBinding(0);
	const [smoothPosition, setSmoothPosition] = useBinding(Vector2.zero);
	const [smoothAngle, setSmoothAngle] = useBinding(0);

	useEventListener(RunService.Heartbeat, (deltaTime) => {
		const step = 1 - math.exp(-deltaTime * 10);

		smoothFrom.current = smoothFrom.current.Lerp(from, step);
		smoothTo.current = smoothTo.current.Lerp(to, step);

		setSmoothLength(smoothFrom.current.sub(smoothTo.current).Magnitude);
		setSmoothPosition(smoothFrom.current.add(smoothTo.current).div(2));
		setSmoothAngle(
			math.atan2(smoothTo.current.Y - smoothFrom.current.Y, smoothTo.current.X - smoothFrom.current.X) +
				SNAKE_ANGLE_OFFSET,
		);
	});

	return (
		<Frame
			size={smoothLength.map((length) => new UDim2(0, size * rem, 0, size * rem + length * rem))}
			position={smoothPosition.map(
				(position) => new UDim2(0, math.round(position.X * rem), 0, math.round(position.Y * rem)),
			)}
			rotation={smoothAngle.map(math.deg)}
			anchorPoint={new Vector2(0.5, 0.5)}
			cornerRadius={new UDim(1, 0)}
			backgroundColor={Color3.fromRGB(51, 130, 97).Lerp(Color3.fromRGB(0, 0, 0), (index + 1) / 20)}
			zIndex={-index}
		/>
	);
}
