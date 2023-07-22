import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectLocalSnake } from "shared/store/snakes";
import { Mouse } from "./mouse";

export function Controller() {
	const snake = useSelector(selectLocalSnake);

	if (!snake) {
		return <></>;
	}

	return <Mouse />;
}
