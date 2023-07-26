import { GroupMotor, Instant, Spring } from "@rbxts/flipper";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { createBinding, useEffect, useMemo, useRef } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { SnakeEntity, describeSnakeFromScore, selectSnakeIsBoosting } from "shared/store/snakes";
import { SnakeOnScreen } from "./use-snakes-on-screen";

export type SnakeLineBinding = Roact.Binding<LineMotorValues>;

export type SnakeEffectBinding = Roact.Binding<EffectMotorValues>;

interface SnakeBindings {
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

type LineMotorValues = {
	readonly diameter: number;
	readonly fromX: number;
	readonly fromY: number;
	readonly toX: number;
	readonly toY: number;
};

type EffectMotorValues = {
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
		const lineMotor = new GroupMotor<LineMotorValues>(
			{
				diameter: getSize(snake) * scale,
				fromX: tracer.X * scale,
				fromY: tracer.Y * scale,
				toX: tracer.X * scale,
				toY: tracer.Y * scale,
			},
			false,
		);

		const effectMotor = new GroupMotor<EffectMotorValues>(
			{
				boost: snake.boost ? 1 : 0,
				dead: snake.dead ? 1 : 0,
			},
			false,
		);

		const [line, setLine] = createBinding(lineMotor.getValue());
		const [effects, setEffects] = createBinding(effectMotor.getValue());

		const connection = RunService.Heartbeat.Connect((deltaTime) => {
			if (!lineMotor.step(deltaTime)) {
				setLine(lineMotor.getValue());
			}

			if (!effectMotor.step(deltaTime)) {
				setEffects(effectMotor.getValue());
			}
		});

		const createGoal = (goal: number, isSubject: boolean) => {
			return isSubject ? new Spring(goal) : new Spring(goal, { frequency: 3 });
		};

		const update = (snake: SnakeEntity, scale: number, boosting: boolean, isSubject: boolean) => {
			const tracer = snake.tracers[index];
			const previousTracer = snake.tracers[index - 1] || snake.head;

			if (!tracer || !previousTracer) {
				return;
			}

			lineMotor.setGoal({
				diameter: new Instant(getSize(snake) * scale),
				fromX: createGoal(previousTracer.X * scale, isSubject),
				fromY: createGoal(previousTracer.Y * scale, isSubject),
				toX: createGoal(tracer.X * scale, isSubject),
				toY: createGoal(tracer.Y * scale, isSubject),
			});

			effectMotor.setGoal({
				boost: new Spring(boosting ? 1 : 0, { frequency: 1 }),
				dead: new Spring(snake.dead ? 1 : 0, { frequency: 1 }),
			});
		};

		const destroy = () => {
			connection.Disconnect();
			lineMotor.destroy();
			effectMotor.destroy();
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
	const skipNext = useRef(false);
	const boosting = useSelectorCreator(selectSnakeIsBoosting, snakeOnScreen.snake.id);

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
