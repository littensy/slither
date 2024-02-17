import { useInterval } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useStore } from "client/hooks";
import { selectSnakeSpectated } from "client/store/world";
import { cycleNextSnake, selectLocalSnake } from "shared/store/snakes";

export function WorldSubject() {
	const store = useStore();
	const snakeClient = useSelector(selectLocalSnake);
	const snakeSpectated = useSelector(selectSnakeSpectated);

	useEffect(() => {
		if (snakeClient) {
			store.setWorldSubject(snakeClient.id);
		} else if (snakeSpectated) {
			store.setWorldSubject(snakeSpectated.id);
		}
	}, [snakeClient?.id, snakeSpectated?.id]);

	useInterval(() => {
		if (!snakeSpectated) {
			store.setWorldSpectating(store.getState(cycleNextSnake("")));
		}
	}, 1);

	return <></>;
}
