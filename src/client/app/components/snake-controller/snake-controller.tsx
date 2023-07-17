import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectLocalSnake } from "shared/store/snakes";
import { SnakeInput } from "./snake-input";

export function SnakeController() {
	const snake = useSelector(selectLocalSnake);

	if (!snake) {
		return <></>;
	}

	return <SnakeInput />;
}
