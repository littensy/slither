import { useEventListener } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";

interface GamepadProps {
	readonly updateAngle: (angle: number) => void;
	readonly setBoost: (boost: boolean) => void;
}

const BOOST_KEYS = new Set<Enum.KeyCode>([Enum.KeyCode.ButtonR2, Enum.KeyCode.ButtonL2, Enum.KeyCode.ButtonA]);
const THUMBSTICK_KEYS = new Set<Enum.KeyCode>([Enum.KeyCode.Thumbstick1, Enum.KeyCode.Thumbstick2]);
const THUMBSTICK_DEADZONE = 0.3;

export function Gamepad({ updateAngle, setBoost }: GamepadProps) {
	useEventListener(UserInputService.InputBegan, (input) => {
		if (input.UserInputType === Enum.UserInputType.Gamepad1 && BOOST_KEYS.has(input.KeyCode)) {
			setBoost(true);
		}
	});

	useEventListener(UserInputService.InputEnded, (input) => {
		if (input.UserInputType === Enum.UserInputType.Gamepad1 && BOOST_KEYS.has(input.KeyCode)) {
			setBoost(false);
		}
	});

	useEventListener(UserInputService.InputChanged, (input) => {
		if (
			input.UserInputType === Enum.UserInputType.Gamepad1 &&
			THUMBSTICK_KEYS.has(input.KeyCode) &&
			input.Position.Magnitude > THUMBSTICK_DEADZONE
		) {
			const angle = math.atan2(-input.Position.Y, input.Position.X);
			updateAngle(angle);
		}
	});

	return <></>;
}
