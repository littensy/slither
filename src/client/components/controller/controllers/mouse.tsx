import Roact, { useEffect, useState } from "@rbxts/roact";
import { InputCapture } from "client/common/input-capture";
import { lerpRadians } from "shared/utils/math-utils";

interface MouseProps {
	readonly updateAngle: (angle: number) => void;
	readonly setBoost: (boost: boolean) => void;
}

const KEY_CODES = new ReadonlySet<Enum.UserInputType | Enum.KeyCode>([
	Enum.UserInputType.MouseButton1,
	Enum.KeyCode.Space,
	Enum.KeyCode.LeftShift,
]);

const MOVE_DIRECTIONS = new ReadonlyMap<Enum.KeyCode, number>([
	[Enum.KeyCode.D, 0],
	[Enum.KeyCode.W, math.rad(-90)],
	[Enum.KeyCode.A, math.rad(-180)],
	[Enum.KeyCode.S, math.rad(90)],
	[Enum.KeyCode.Right, 0],
	[Enum.KeyCode.Up, math.rad(-90)],
	[Enum.KeyCode.Left, math.rad(-180)],
	[Enum.KeyCode.Down, math.rad(90)],
]);

export function Mouse({ updateAngle, setBoost }: MouseProps) {
	const [keysDown, setKeysDown] = useState<Enum.KeyCode[]>([]);

	useEffect(() => {
		const averageAngle = keysDown.reduce<number | undefined>((acc, key) => {
			const angle = MOVE_DIRECTIONS.get(key)!;
			return lerpRadians(acc ?? angle, angle, 0.5);
		}, undefined);

		if (averageAngle !== undefined) {
			updateAngle(averageAngle);
		}
	}, [keysDown]);

	return (
		<InputCapture
			onInputChanged={(frame, input) => {
				if (input.UserInputType !== Enum.UserInputType.MouseMovement || !keysDown.isEmpty()) {
					return;
				}

				const mouse = new Vector2(input.Position.X, input.Position.Y);
				const direction = mouse.sub(frame.AbsolutePosition).sub(frame.AbsoluteSize.div(2));
				const angle = math.atan2(direction.Y, direction.X);

				updateAngle(angle);
			}}
			onInputBegan={(_, input) => {
				if (KEY_CODES.has(input.KeyCode) || KEY_CODES.has(input.UserInputType)) {
					setBoost(true);
				} else if (MOVE_DIRECTIONS.has(input.KeyCode) && !keysDown.includes(input.KeyCode)) {
					setKeysDown((keysDown) => [input.KeyCode, ...keysDown]);
				}
			}}
			onInputEnded={(_, input) => {
				if (KEY_CODES.has(input.KeyCode) || KEY_CODES.has(input.UserInputType)) {
					setBoost(false);
				} else if (MOVE_DIRECTIONS.has(input.KeyCode)) {
					setKeysDown((keysDown) => keysDown.filter((key) => key !== input.KeyCode));
				}
			}}
		/>
	);
}
