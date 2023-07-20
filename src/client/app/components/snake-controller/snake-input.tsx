import { useThrottleCallback } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { InputCapture } from "client/app/common/input-capture";
import { remotes } from "shared/remotes";

export function SnakeInput() {
	const updateAngle = useThrottleCallback(
		(angle: number) => {
			remotes.snake.move.fire(angle);
		},
		{ wait: 1 / 20 },
	);

	const setBoost = (boost: boolean) => {
		remotes.snake.boost.fire(boost);
	};

	const onInputChanged = (frame: Frame, input: InputObject) => {
		if (
			input.UserInputType === Enum.UserInputType.MouseMovement ||
			input.UserInputType === Enum.UserInputType.Touch
		) {
			const mouse = new Vector2(input.Position.X, input.Position.Y);
			const direction = mouse.sub(frame.AbsolutePosition).sub(frame.AbsoluteSize.div(2));
			const angle = math.atan2(direction.Y, direction.X);

			updateAngle.run(angle);
		}
	};

	const onInputBegan = (frame: Frame, input: InputObject) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setBoost(true);
		}
	};

	const onInputEnded = (frame: Frame, input: InputObject) => {
		if (input.UserInputType === Enum.UserInputType.MouseButton1) {
			setBoost(false);
		}
	};

	return <InputCapture onInputChanged={onInputChanged} onInputBegan={onInputBegan} onInputEnded={onInputEnded} />;
}
