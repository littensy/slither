import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import { useStore } from "client/app/hooks";
import { selectLocalSnake, selectTopSnake } from "shared/store/snakes";

export function WorldFocus() {
	const store = useStore();
	const localSnake = useSelector(selectLocalSnake);
	const topSnake = useSelector(selectTopSnake);

	useEffect(() => {
		const focus = localSnake || topSnake;

		if (!focus) {
			return;
		}

		return setTimeout(
			() => {
				store.setWorldFocus(focus.id);
			},
			localSnake ? 0 : 2,
		);
	}, [localSnake?.id, topSnake?.id]);

	return <></>;
}
