import { usePrevious } from "@rbxts/pretty-react-hooks";
import { useRef } from "@rbxts/roact";
import { subtractRadians } from "shared/utils/math-utils";

/**
 * Returns a continuous angle that is always the shortest distance from the
 * previous angle. Used to prevent angles looping around when they reach
 * 360 degrees.
 */
export function useContinuousAngle(angle: number) {
	const previousAngle = usePrevious(angle) ?? angle;
	const continuousAngle = useRef(angle);

	if (previousAngle !== angle) {
		continuousAngle.current += subtractRadians(angle, previousAngle);
	}

	return continuousAngle.current;
}
