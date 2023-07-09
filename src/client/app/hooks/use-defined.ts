import { useLatest } from "@rbxts/pretty-react-hooks";

/**
 * Returns true if the two values are equal and the new value is defined.
 * @param a The previous value.
 * @param b The new value.
 * @returns True if the two values are equal and the new value is defined.
 */
function isEqualOrUndefined(a: unknown, b: unknown) {
	return a === b || b === undefined;
}

/**
 * Returns the latest defined value.
 * @param value The value to use.
 * @returns A non-nullable value.
 */
export function useDefined<T>(value: T | undefined, initialValue: T): T;
export function useDefined<T>(value: T, initialValue?: T): T;
export function useDefined<T>(value: T, initialValue?: T) {
	return useLatest(value, isEqualOrUndefined).current ?? initialValue;
}
