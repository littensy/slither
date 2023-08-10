import { useLatestCallback } from "@rbxts/pretty-react-hooks";
import { createMotion, Motion, MotionGoal } from "@rbxts/ripple";
import { Binding, useBinding, useEffect, useMemo } from "@rbxts/roact";

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
		return createMotion(goal, { start: true });
	}, []);

	const get = useLatestCallback((value = motion.get()) => {
		return mapper ? mapper(value) : value;
	});

	const [binding, setValue] = useBinding(get());

	useEffect(() => {
		setValue(get());
	}, [mapper]);

	useEffect(() => {
		return motion.onStep((value) => {
			setValue(get(value));
		});
	}, []);

	useEffect(() => {
		return () => {
			motion.destroy();
		};
	}, []);

	return $tuple(binding, motion);
}
