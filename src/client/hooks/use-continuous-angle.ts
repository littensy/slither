import { useMemo, useRef } from "@rbxts/react";
import { subtractRadians } from "shared/utils/math-utils";

/**
 * Returns a continuous angle that is always the shortest distance from the
 * previous angle. Used to prevent angles looping around when they reach
 * 360 degrees.
 */
export function useContinuousAngle(angle: number) {
	const previousAngle = useRef(angle);
	const continuousAngle = useRef(angle);

	useMemo(() => {
		continuousAngle.current += subtractRadians(angle, previousAngle.current);
		previousAngle.current = angle;
	}, [angle]);

	return continuousAngle.current;
}
