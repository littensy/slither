import Roact from "@rbxts/roact";
import { InputCapture } from "client/app/common/input-capture";

interface MouseProps {
	readonly updateAngle: (angle: number) => void;
	readonly setBoost: (boost: boolean) => void;
}

export function Mouse({ updateAngle, setBoost }: MouseProps) {
	return (
		<InputCapture
			onInputChanged={(frame, input) => {
				if (input.UserInputType !== Enum.UserInputType.MouseMovement) {
					return;
				}

				const mouse = new Vector2(input.Position.X, input.Position.Y);
				const direction = mouse.sub(frame.AbsolutePosition).sub(frame.AbsoluteSize.div(2));
				const angle = math.atan2(direction.Y, direction.X);

				updateAngle(angle);
			}}
			onInputBegan={(frame, input) => {
				if (input.UserInputType !== Enum.UserInputType.MouseButton1) {
					return;
				}

				setBoost(true);
			}}
			onInputEnded={(frame, input) => {
				if (input.UserInputType !== Enum.UserInputType.MouseButton1) {
					return;
				}

				setBoost(false);
			}}
		/>
	);
}
