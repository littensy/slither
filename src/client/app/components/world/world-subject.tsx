import { useInterval } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { useStore } from "client/app/hooks";
import { selectLocalSnake, selectTopSnake } from "shared/store/snakes";

export function WorldSubject() {
	const store = useStore();
	const localSnake = useSelector(selectLocalSnake);
	const topSnake = useSelector(selectTopSnake);

	useEffect(() => {
		if (localSnake) {
			store.setWorldSubject(localSnake.id);
		}
	}, [localSnake?.id, topSnake?.id]);

	useInterval(() => {
		if (!localSnake && topSnake) {
			store.setWorldSubject(topSnake.id);
		}
	}, 2);

	return <></>;
}
