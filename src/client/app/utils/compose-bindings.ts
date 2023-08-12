import { isBinding, toBinding } from "@rbxts/pretty-react-hooks";
import Roact, { joinBindings } from "@rbxts/roact";

type Bindable<T = unknown> = Roact.Binding<T> | NonNullable<T>;

type ComposeBindings<T extends Bindable[]> = {
	[K in keyof T]: T[K] extends Bindable<infer U> ? U : T[K];
};

type BindingCombiner<T extends Bindable[], U> = (...values: ComposeBindings<T>) => U;

/**
 * Composes multiple bindings or values together into a single binding.
 * Calls the combiner function with the values of the bindings when any
 * of the bindings change.
 */
export function composeBindings<T extends Bindable[], U>(...bindings: [...T, BindingCombiner<T, U>]): Roact.Binding<U>;

export function composeBindings<T>(...values: [...Bindable[], BindingCombiner<Bindable[], T>]): Roact.Binding<T> {
	const combiner = values.pop() as BindingCombiner<Bindable[], T>;
	const bindings = values.map((value) => {
		return isBinding(value) ? value : toBinding(value);
	});

	return joinBindings(bindings).map((bindings) => combiner(...bindings));
}
