import React, { createBinding, useEffect, useMemo, useRef } from "@rbxts/react";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { createSpring } from "@rbxts/ripple";
import { springs } from "client/constants/springs";
import { describeSnakeFromScore, selectSnakeIsBoosting, SnakeEntity } from "shared/store/snakes";

import { SnakeOnScreen } from "./use-snakes-on-screen";

export type SnakeLineBinding = React.Binding<LineSpringValues>;

export type SnakeEffectBinding = React.Binding<EffectSpringValues>;

export interface SnakeBindings {
	readonly bindings: Map<number, TracerBindingController>;
	readonly head: TracerBindingController;
	readonly update: (snakeOnScreen: SnakeOnScreen, scale: number, boosting: boolean, isSubject: boolean) => void;
	readonly destroy: () => void;
}

interface TracerBindingController {
	readonly index: number;
	readonly line: SnakeLineBinding;
	readonly effects: SnakeEffectBinding;
	readonly update: (snake: SnakeEntity, scale: number, boosting: boolean, isSubject: boolean) => void;
	readonly destroy: () => void;
}

type LineSpringValues = {
	readonly diameter: number;
	readonly fromX: number;
	readonly fromY: number;
	readonly toX: number;
	readonly toY: number;
};

type EffectSpringValues = {
	readonly boost: number;
	readonly dead: number;
};

function getSize(snake: SnakeEntity) {
	return describeSnakeFromScore(snake.score).radius * 2;
}

function createSnakeBindings(snake: SnakeEntity, scale: number): SnakeBindings {
	const tracerBindings = new Map<number, TracerBindingController>();

	const createTracerBindings = (
		snake: SnakeEntity,
		index: number,
		scale: number,
		tracer: Vector2,
	): TracerBindingController => {
		const lineSpring = createSpring<LineSpringValues>({
			diameter: getSize(snake) * scale,
			fromX: tracer.X * scale,
			fromY: tracer.Y * scale,
			toX: tracer.X * scale,
			toY: tracer.Y * scale,
		});

		const effectSpring = createSpring<EffectSpringValues>({
			boost: snake.boost ? 1 : 0,
			dead: snake.dead ? 1 : 0,
		});

		const [line, setLine] = createBinding(lineSpring.getPosition());
		const [effects, setEffects] = createBinding(effectSpring.getPosition());

		lineSpring.onChange(setLine);
		lineSpring.start();

		effectSpring.configure(springs.slow);
		effectSpring.onChange(setEffects);
		effectSpring.start();

		const update = (snake: SnakeEntity, scale: number, boosting: boolean, isSubject: boolean) => {
			const tracer = snake.tracers[index];
			const previousTracer = snake.tracers[index - 1] || snake.head;

			if (!tracer || !previousTracer) {
				return;
			}

			const diameter = getSize(snake) * scale;

			lineSpring.setPosition({ diameter });
			lineSpring.configure(isSubject ? springs.world : springs.default);
			lineSpring.setGoal({
				diameter,
				fromX: tracer.X * scale,
				fromY: tracer.Y * scale,
				toX: previousTracer.X * scale,
				toY: previousTracer.Y * scale,
			});

			effectSpring.setGoal({
				boost: boosting ? 1 : 0,
				dead: snake.dead ? 1 : 0,
			});
		};

		const destroy = () => {
			lineSpring.destroy();
			effectSpring.destroy();
		};

		return { index, line, effects, update, destroy };
	};

	const headBinding = createTracerBindings(snake, 0, scale, snake.head);

	const update = ({ snake, tracers }: SnakeOnScreen, scale: number, boosting: boolean, isSubject: boolean) => {
		headBinding.update(snake, scale, boosting, isSubject);

		tracers.forEach((tracer) => {
			let tracerBinding = tracerBindings.get(tracer.index);

			if (!tracerBinding) {
				tracerBinding = createTracerBindings(snake, tracer.index, scale, tracer.position);
				tracerBindings.set(tracer.index, tracerBinding);
			}

			tracerBinding.update(snake, scale, boosting, isSubject);
		});

		// remove tracers that are no longer on screen
		for (const [key, tracerBinding] of tracerBindings) {
			const tracer = tracers.find((tracer) => {
				return tracer.index === tracerBinding.index;
			});

			if (!tracer) {
				tracerBinding.destroy();
				tracerBindings.delete(key);
			}
		}
	};

	const destroy = () => {
		for (const [, tracerBinding] of tracerBindings) {
			tracerBinding.destroy();
		}

		headBinding.destroy();
		tracerBindings.clear();
	};

	return { bindings: tracerBindings, head: headBinding, update, destroy };
}

export function useSnakeBindings(snakeOnScreen: SnakeOnScreen, scale: number, isSubject: boolean): SnakeBindings {
	const boosting = useSelectorCreator(selectSnakeIsBoosting, snakeOnScreen.snake.id);
	const skipNext = useRef(false);

	const bindings = useMemo(() => {
		return createSnakeBindings(snakeOnScreen.snake, scale);
	}, []);

	useEffect(() => {
		// if this is not the subject, skip every other frame
		if (!isSubject) {
			skipNext.current = !skipNext.current;

			if (skipNext.current) {
				return;
			}
		}

		bindings.update(snakeOnScreen, scale, boosting, isSubject);
	}, [snakeOnScreen, boosting, isSubject]);

	useEffect(() => {
		return () => {
			bindings.destroy();
		};
	}, []);

	return bindings;
}
