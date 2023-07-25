import { map, useCamera, useDebounceState, useEventListener } from "@rbxts/pretty-react-hooks";
import Roact, { createContext, useCallback } from "@rbxts/roact";

export interface RemProviderProps extends Roact.PropsWithChildren {
	baseRem?: number;
	remOverride?: number;
	minimumRem?: number;
	maximumRem?: number;
}

export const BASE_REM_RESOLUTION = new Vector2(1920, 1020);
export const BASE_REM = 16;
export const MINIMUM_REM = 10;

export const RemContext = createContext<number>(BASE_REM);

export function RemProvider({
	baseRem = BASE_REM,
	minimumRem = MINIMUM_REM,
	maximumRem,
	remOverride,
	children,
}: RemProviderProps) {
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

		let rem = math.round(baseRem * scale);

		if (maximumRem !== undefined) {
			rem = math.min(rem, maximumRem);
		}

		if (minimumRem !== undefined) {
			rem = math.max(rem, minimumRem);
		}

		return rem;
	}, [camera]);

	const [rem, setRem] = useDebounceState(getRem(), { wait: 0.5, leading: true });

	useEventListener(camera.GetPropertyChangedSignal("ViewportSize"), () => {
		setRem(getRem());
	});

	return <RemContext.Provider value={rem}>{children}</RemContext.Provider>;
}
