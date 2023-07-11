import Roact from "@rbxts/roact";
import { Group } from "./group";

interface InputCaptureProps {
	readonly onInputBegan?: (rbx: Frame, input: InputObject) => void;
	readonly onInputChanged?: (rbx: Frame, input: InputObject) => void;
	readonly onInputEnded?: (rbx: Frame, input: InputObject) => void;
}

export function InputCapture({ onInputBegan, onInputChanged, onInputEnded }: InputCaptureProps) {
	return (
		<Group
			event={{
				InputBegan: onInputBegan,
				InputChanged: onInputChanged,
				InputEnded: onInputEnded,
			}}
		/>
	);
}
