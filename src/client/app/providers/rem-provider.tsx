import { map, useCamera, useDebounceState, useEventListener } from "@rbxts/pretty-react-hooks";
import Roact, { createContext, useCallback } from "@rbxts/roact";

export interface RemProviderProps extends Roact.PropsWithChildren {
	baseRem?: number;
	remOverride?: number;
}

export const BASE_REM_RESOLUTION = new Vector2(1920, 1020);
export const BASE_REM = 16;

export const RemContext = createContext<number>(BASE_REM);

/**
 * Scales a UDim2 value to be relative to the current rem.
 * @param value The UDim2 to scale.
 * @returns The scaled value.
 */
export function scale<T extends UDim2 | UDim | number>(value: T, rem: number): T {
	if (typeIs(value, "UDim2")) {
		return new UDim2(
			value.X.Scale,
			math.round(value.X.Offset * (rem / BASE_REM)),
			value.Y.Scale,
			math.round(value.Y.Offset * (rem / BASE_REM)),
		) as T;
	} else if (typeIs(value, "UDim")) {
		return new UDim(value.Scale, math.round(value.Offset * (rem / BASE_REM))) as T;
	} else if (typeIs(value, "number")) {
		return math.round(value * (rem / BASE_REM)) as T;
	} else {
		return value;
	}
}

export function RemProvider({ baseRem = BASE_REM, remOverride, children }: RemProviderProps) {
	const camera = useCamera();

	const getRem = useCallback(() => {
		if (remOverride !== undefined) return remOverride;

		const cameraSize = camera.ViewportSize;
		const size = new Vector2(math.min(cameraSize.X, cameraSize.Y * (19 / 9)), cameraSize.Y);
		let scale = size.Magnitude / BASE_REM_RESOLUTION.Magnitude;

		// portrait mode should downscale slower
		if (size.Y > size.X && scale < 1) {
			scale = map(scale, 0, 1, 0.25, 1);
		}

		return math.round(baseRem * scale);
	}, [camera]);

	const [rem, setRem] = useDebounceState(getRem(), { wait: 0.5, leading: true });

	useEventListener(camera.GetPropertyChangedSignal("ViewportSize"), () => {
		setRem(getRem());
	});

	return <RemContext.Provider value={rem}>{children}</RemContext.Provider>;
}
