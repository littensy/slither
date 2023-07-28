import { useCamera, useEventListener } from "@rbxts/pretty-react-hooks";
import { useRef, useState } from "@rbxts/roact";
import { Players, UserInputService } from "@rbxts/services";
import { useCharacter } from "client/app/hooks";

/**
 * Returns the direction the player is moving in and whether
 * or not they are jumping.
 */
export function useTouchMove() {
	const camera = useCamera();
	const character = useCharacter(Players.LocalPlayer);
	const humanoid = character?.Humanoid;

	const touchPosition = useRef(Vector2.zero);
	const [touchInput, setTouchInput] = useState<InputObject>();
	const [touchStart, setTouchStart] = useState(Vector2.zero);
	const [direction, setDirection] = useState(Vector2.zero);
	const [jumping, setJumping] = useState(false);

	// Only set direction if the input caused the player to move
	const isMoving = () => {
		return character?.Humanoid.MoveDirection !== Vector3.zero;
	};

	// Only set direction if this input started on the left side
	// of the screen
	const getSide = (input: InputObject): "left" | "right" => {
		return input.Position.X < camera.ViewportSize.X / 2 ? "left" : "right";
	};

	useEventListener(UserInputService.TouchStarted, (input) => {
		if (getSide(input) === "left") {
			const position = new Vector2(input.Position.X, input.Position.Y);
			setTouchInput(input);
			setTouchStart(position);
			touchPosition.current = position;
		}
	});

	useEventListener(UserInputService.TouchEnded, (input) => {
		if (input === touchInput) {
			setTouchInput(undefined);
		}

		if (getSide(input) === "right") {
			setJumping(false);
		}
	});

	useEventListener(UserInputService.TouchMoved, (input) => {
		if (input === touchInput) {
			touchPosition.current = new Vector2(input.Position.X, input.Position.Y);
		}
	});

	useEventListener(humanoid?.GetPropertyChangedSignal("MoveDirection"), () => {
		if (humanoid && humanoid.MoveDirection !== Vector3.zero) {
			const delta = touchPosition.current.sub(touchStart);
			const direction = delta !== Vector2.zero ? delta.Unit : Vector2.zero;
			setDirection(direction);
		}
	});

	useEventListener(UserInputService.JumpRequest, () => {
		setJumping(true);
	});

	return $tuple(direction, jumping);
}
