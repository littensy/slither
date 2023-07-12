import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { useStore } from "client/app/hooks";
import { selectLocalSnake } from "shared/store/snakes";
import { SnakeInput } from "./snake-input";

export function SnakeController() {
	const store = useStore();
	const snake = useSelector(selectLocalSnake);

	useEffect(() => {
		if (snake !== undefined) {
			store.setWorldFocus(snake.id);
		}
	}, [snake?.id]);

	if (!snake) {
		return <></>;
	}

	return <SnakeInput />;
}
