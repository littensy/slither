import { useContext } from "@rbxts/roact";
import { BASE_REM, RemContext } from "../providers/rem-provider";

export interface RemOptions {
	upscale?: boolean;
	minimum?: number;
	maximum?: number;
}

/**
 * Returns the height of a 1rem element in pixels. Rounds to the nearest even
 * number.
 * @returns The height of a 1em element in pixels.
 */
export function useRem({ upscale = true, minimum, maximum }: RemOptions = {}) {
	let rem = useContext(RemContext);
	if (!upscale) rem = math.min(rem, BASE_REM);
	if (minimum !== undefined) rem = math.max(rem, minimum);
	if (maximum !== undefined) rem = math.min(rem, maximum);
	return rem;
}
