import { useMemo } from "@rbxts/roact";

/**
 * Generates a random seed unique to this function component.
 */
export function useSeed() {
	return useMemo(() => {
		const random = new Random();
		return random.NextNumber(-256, 256);
	}, []);
}
