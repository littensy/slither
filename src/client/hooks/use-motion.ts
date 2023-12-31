import { useLatestCallback } from "@rbxts/pretty-react-hooks";
import { createMotion, Motion, MotionGoal } from "@rbxts/ripple";
import { Binding, useBinding, useEffect, useMemo } from "@rbxts/roact";
import { RunService } from "@rbxts/services";

export function useMotion<T = number>(
	goal: number,
	mapper?: (value: number) => T,
): LuaTuple<[Binding<T>, Motion<number>]>;

export function useMotion<T extends MotionGoal, U = T>(
	goal: T,
	mapper?: (value: T) => U,
): LuaTuple<[Binding<U>, Motion<T>]>;

export function useMotion<T extends MotionGoal, U>(goal: T, mapper?: (value: T) => U) {
	const motion = useMemo(() => {
		return createMotion(goal);
	}, []);

	const get = useLatestCallback(() => {
		const value = motion.get();
		return mapper ? mapper(value) : value;
	});

	const [binding, setValue] = useBinding(get());

	useEffect(() => {
		setValue(get());
	}, [mapper]);

	useEffect(() => {
		const connection = RunService.Heartbeat.Connect((delta) => {
			motion.step(delta);
			setValue(get());
		});

		return () => {
			connection.Disconnect();
			motion.destroy();
		};
	}, [motion]);

	return $tuple(binding, motion);
}
