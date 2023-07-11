import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { InputCapture } from "client/app/common/input-capture";
import { useStore } from "client/app/hooks";
import { remotes } from "shared/remotes";
import { selectLocalSnake } from "shared/store/snakes";

export function SnakeController() {
	const store = useStore();
	const snake = useSelector(selectLocalSnake);

	const updateAngle = (angle: number) => {
		remotes.snake.move.fire(angle);
	};

	useEffect(() => {
		if (snake !== undefined) {
			store.setWorldFocus(snake.id);
		}
	}, [snake?.id]);

	return (
		<InputCapture
			onInputChanged={(rbx, input) => {
				if (!snake) {
					return;
				}

				if (
					input.UserInputType === Enum.UserInputType.MouseMovement ||
					input.UserInputType === Enum.UserInputType.Touch
				) {
					const mouse = new Vector2(input.Position.X, input.Position.Y);
					const direction = mouse.sub(rbx.AbsolutePosition).sub(rbx.AbsoluteSize.div(2));
					const angle = math.atan2(direction.Y, direction.X);

					updateAngle(angle);
				}
			}}
		/>
	);
}
