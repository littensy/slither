import { useCallback, useContext } from "@rbxts/roact";
import { DEFAULT_REM, RemContext } from "../providers/rem-provider";

export interface RemOptions {
	minimum?: number;
	maximum?: number;
}

interface RemCallback {
	(value: number, mode?: RemScaleMode): number;
	(value: UDim2, mode?: RemScaleMode): UDim2;
	(value: UDim, mode?: RemScaleMode): UDim;
	(value: Vector2, mode?: RemScaleMode): Vector2;
}

type RemScaleMode = "relative" | "unit";

const scaleFunctions = {
	number: (value: number, rem: number): number => {
		return value * rem;
	},

	UDim2: (value: UDim2, rem: number): UDim2 => {
		return new UDim2(value.X.Scale, value.X.Offset * rem, value.Y.Scale, value.Y.Offset * rem);
	},

	UDim: (value: UDim, rem: number): UDim => {
		return new UDim(value.Scale, value.Offset * rem);
	},

	Vector2: (value: Vector2, rem: number): Vector2 => {
		return new Vector2(value.X * rem, value.Y * rem);
	},
};

function useRemContext({ minimum = 0, maximum = math.huge }: RemOptions = {}) {
	const rem = useContext(RemContext);
	return math.clamp(rem, minimum, maximum);
}

export function useRem(options?: RemOptions): RemCallback {
	const rem = useRemContext(options);

	return useCallback(
		<T>(value: T, mode: RemScaleMode = "unit"): T => {
			const scale = scaleFunctions[typeOf(value) as never] as <T>(value: T, rem: number) => T;

			if (!scale) {
				return value;
			}

			return mode === "unit" ? scale(value, rem) : scale(value, rem / DEFAULT_REM);
		},
		[rem],
	);
}
