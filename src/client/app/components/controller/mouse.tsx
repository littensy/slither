import { useThrottleCallback } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { InputCapture } from "client/app/common/input-capture";
import { REMOTE_TICK, WORLD_TICK } from "shared/constants";
import { remotes } from "shared/remotes";

export function Mouse() {
	const updateAngle = useThrottleCallback(
		(angle: number) => {
			remotes.snake.move.fire(angle);
		},
		{ wait: REMOTE_TICK, leading: true, trailing: true },
	);

	const setBoost = useThrottleCallback(
		(boost: boolean) => {
			remotes.snake.boost.fire(boost);
		},
		{ wait: WORLD_TICK, leading: true, trailing: true },
	);

	return (
		<InputCapture
			onInputChanged={(frame, input) => {
				if (input.UserInputType === Enum.UserInputType.MouseMovement) {
					const mouse = new Vector2(input.Position.X, input.Position.Y);
					const direction = mouse.sub(frame.AbsolutePosition).sub(frame.AbsoluteSize.div(2));
					const angle = math.atan2(direction.Y, direction.X);

					updateAngle.run(angle);
				}
			}}
			onInputBegan={(frame, input) => {
				if (input.UserInputType === Enum.UserInputType.MouseButton1) {
					setBoost.run(true);
				}
			}}
			onInputEnded={(frame, input) => {
				if (input.UserInputType === Enum.UserInputType.MouseButton1) {
					setBoost.run(false);
				}
			}}
		/>
	);
}
