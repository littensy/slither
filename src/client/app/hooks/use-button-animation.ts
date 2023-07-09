import { Spring, useMotor, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo } from "@rbxts/roact";

export interface ButtonAnimation {
	/**
	 * An underdamped spring. `-1` is fully hovered, `0` is neutral, and `1` is
	 * fully pressed. Values outside of this range are possible.
	 */
	readonly position: Roact.Binding<number>;
	/**
	 * A critically damped spring that is `1` when the button is pressed.
	 */
	readonly press: Roact.Binding<number>;
	/**
	 * A critically damped spring that is `1` when the button is hovered.
	 */
	readonly hover: Roact.Binding<number>;
	/**
	 * Same as `hover`, but `pressed` must be `false`.
	 */
	readonly hoverOnly: Roact.Binding<number>;
}

/**
 * Returns a `ButtonAnimation` object that can be used to animate a button.
 * The values provided by the object are:
 *
 * - `position`: An underdamped spring. `-1` is fully hovered, `0` is neutral,
 *  and `1` is fully pressed. Values outside of this range are possible.
 * - `press`: A critically damped spring that is `1` when the button is pressed.
 * - `hover`: A critically damped spring that is `1` when the button is hovered.
 * - `hoverExclusive`: Same as `hover`, but `pressed` must also be `false`.
 *
 * @param pressedState Whether the button is pressed.
 * @param hoveredState Whether the button is hovered.
 * @returns A `ButtonAnimation` object.
 */
export function useButtonAnimation(pressedState: boolean, hoveredState: boolean): ButtonAnimation {
	const [press, setPress] = useMotor(0);
	const [hover, setHover] = useMotor(0);
	const [hoverExclusive, setHoverExclusive] = useMotor(0);
	const [position, setPosition, positionApi] = useMotor(0);

	useUpdateEffect(() => {
		setPress(new Spring(pressedState ? 1 : 0, { frequency: 3 }));
		setHoverExclusive(
			new Spring(hoveredState && !pressedState ? 1 : 0, {
				frequency: hoveredState ? 3 : 1,
				dampingRatio: hoveredState ? 1 : 1.5,
			}),
		);
	}, [pressedState, hoveredState]);

	useUpdateEffect(() => {
		setHover(
			new Spring(hoveredState ? 1 : 0, {
				frequency: hoveredState ? 3 : 1,
				dampingRatio: hoveredState ? 1 : 1.5,
			}),
		);
	}, [hoveredState]);

	useUpdateEffect(() => {
		if (pressedState) {
			// hovered -> pressed
			setPosition(new Spring(1, { frequency: 5 }));
		} else if (hoveredState) {
			// pressed -> hovered
			setPosition(new Spring(-1, { frequency: 3, dampingRatio: 0.4 }));
			positionApi.impulse(-100);
		} else {
			// pressed -> unhovered, but 'hover' was not true
			setPosition(new Spring(0, { frequency: 3, dampingRatio: 0.4 }));
			positionApi.impulse(-75);
		}
	}, [pressedState]);

	useUpdateEffect(() => {
		if (hoveredState) {
			// unhovered -> hovered
			setPosition(new Spring(-1, { frequency: 5 }));
		} else {
			// hovered -> unhovered
			setPosition(new Spring(0, { frequency: 5 }));
		}
	}, [hoveredState]);

	return useMemo<ButtonAnimation>(() => {
		return {
			press,
			hover: hover.map((t) => math.clamp(t, 0, 1)),
			hoverOnly: hoverExclusive.map((t) => math.clamp(t, 0, 1)),
			position,
		};
	}, []);
}
