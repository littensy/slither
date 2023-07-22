import Roact from "@rbxts/roact";
import { Group } from "./group";

interface InputCaptureProps {
	readonly onInputBegan?: (rbx: Frame, input: InputObject) => void;
	readonly onInputChanged?: (rbx: Frame, input: InputObject) => void;
	readonly onInputEnded?: (rbx: Frame, input: InputObject) => void;
	readonly size?: UDim2;
	readonly position?: UDim2;
	readonly anchorPoint?: Vector2;
}

export function InputCapture({
	onInputBegan,
	onInputChanged,
	onInputEnded,
	size,
	position,
	anchorPoint,
}: InputCaptureProps) {
	return (
		<Group
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			event={{
				InputBegan: onInputBegan,
				InputChanged: onInputChanged,
				InputEnded: onInputEnded,
			}}
		/>
	);
}
