import { useCamera, usePrevious, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import { useEffect, useMemo, useState } from "@rbxts/roact";
import { useRem } from "client/app/hooks";
import { selectSnakesById, SnakeEntity } from "shared/store/snakes";
import { Grid } from "shared/utils/grid";

import { SNAKE_ON_SCREEN_MARGIN } from "./constants";

export interface SnakeOnScreen {
	readonly snake: SnakeEntity;
	readonly tracers: SnakeTracer[];
	head?: SnakeTracer;
}

export interface SnakeTracer {
	readonly position: Vector2;
	readonly index: number;
}

interface TracerCell {
	readonly id: string;
	readonly type: "tracer" | "head";
	readonly index: number;
}

export function useSnakesOnScreen(scale: number, offset: Vector2) {
	const rem = useRem();
	const camera = useCamera();

	const snakes = useSelector(selectSnakesById);
	const previousSnakes = usePrevious(snakes) || {};

	const [onScreen, setOnScreen] = useState<SnakeOnScreen[]>([]);

	const grid = useMemo(() => {
		return new Grid<TracerCell>(16);
	}, []);

	useEffect(() => {
		// replace old tracer positions with new ones
		for (const [, snake] of pairs(snakes)) {
			const previousSnake = previousSnakes[snake.id];
			const headCell: TracerCell = { id: snake.id, type: "head", index: -1 };

			// delete old tracers
			previousSnake?.tracers.forEach((tracer, index) => {
				if (!snake.tracers[index]) {
					grid.remove(tracer);
				}
			});

			// insert/replace snake head
			if (previousSnake) {
				grid.replace(previousSnake.head, snake.head, headCell);
			} else {
				grid.insert(snake.head, headCell);
			}

			// insert/replace new tracers
			snake.tracers.forEach((tracer, index) => {
				const tracerCell: TracerCell = { id: snake.id, type: "tracer", index };
				const previousTracer = previousSnake?.tracers[index];

				if (previousTracer) {
					grid.replace(previousTracer, tracer, tracerCell);
				} else {
					grid.insert(tracer, tracerCell);
				}
			});
		}

		// remove snakes that are no longer on the grid
		for (const [, snake] of pairs(previousSnakes)) {
			if (snakes[snake.id]) {
				continue;
			}

			grid.remove(snake.head);

			for (const tracer of snake.tracers) {
				grid.remove(tracer);
			}
		}
	}, [snakes]);

	useEffect(() => {
		// query on-screen snakes and update the state
		const viewport = camera.ViewportSize.div(rem(scale));
		const margin = new Vector2(SNAKE_ON_SCREEN_MARGIN, SNAKE_ON_SCREEN_MARGIN).div(scale);

		const boxPosition = viewport.div(2).add(offset).add(margin).mul(-1);
		const boxSize = viewport.add(margin.mul(2));

		const snakesOnScreenById = new Map<string, SnakeOnScreen>();
		const snakesOnScreen: SnakeOnScreen[] = [];

		for (const point of grid.queryBox(boxPosition, boxSize)) {
			const snake = snakes[point.metadata.id];

			if (!snake) {
				continue;
			}

			const snakeOnScreen = snakesOnScreenById.get(point.metadata.id);
			const snakeTracer: SnakeTracer = {
				position: point.position,
				index: point.metadata.index,
			};

			if (snakeOnScreen) {
				if (snakeTracer.index === -1) {
					snakeOnScreen.head = snakeTracer;
					continue;
				}

				// insert the tracer at the correct index to end up with
				// a sorted array of tracers by index
				const insertAt = snakeOnScreen.tracers.findIndex((tracer) => {
					return tracer.index > snakeTracer.index;
				});

				if (insertAt === -1) {
					snakeOnScreen.tracers.push(snakeTracer);
				} else {
					snakeOnScreen.tracers.insert(insertAt, snakeTracer);
				}

				continue;
			}

			const newSnakeOnScreen: SnakeOnScreen = {
				snake,
				tracers: snakeTracer.index === -1 ? [] : [snakeTracer],
				head: snakeTracer.index === -1 ? snakeTracer : undefined,
			};

			snakesOnScreen.push(newSnakeOnScreen);
			snakesOnScreenById.set(point.metadata.id, newSnakeOnScreen);
		}

		setOnScreen(snakesOnScreen);
	}, [snakes, scale, offset, rem]);

	useUnmountEffect(() => {
		grid.clear();
	});

	return onScreen;
}
