import { useSelectorCreator } from "@rbxts/react-reflex";
import { useMemo } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { useDefined } from "client/app/hooks";
import { getSegmentRadius, selectSnakeById } from "shared/store/snakes";

interface WorldView {
	readonly offset: Vector2;
	readonly scale: number;
}

const SNAKE_SCALE = 5;

export function useWorldView(): WorldView {
	const snakeNullable = useSelectorCreator(selectSnakeById, Players.LocalPlayer.Name);
	const snake = useDefined(snakeNullable);

	// view only updates while the snake is not nil
	return useMemo(() => {
		if (!snake) {
			return { offset: Vector2.zero, scale: 1 };
		}

		const scale = getSegmentRadius(snake.score) * 2 * SNAKE_SCALE;
		const offset = snake.head.mul(-1);

		return { offset, scale };
	}, [snake]);
}
