import { useCallback, useContext } from "@rbxts/roact";
import { RemContext } from "../providers/rem-provider";

export interface RemOptions {
	minimum?: number;
	maximum?: number;
}

type ScaleFunctions = {
	[K in keyof CheckableTypes]?: (value: CheckableTypes[K], rem: number) => CheckableTypes[K];
};

const scaleFunctions: ScaleFunctions = {
	UDim2: (value, rem) => {
		return new UDim2(value.X.Scale, value.X.Offset * rem, value.Y.Scale, value.Y.Offset * rem);
	},

	UDim: (value, rem) => {
		return new UDim(value.Scale, value.Offset * rem);
	},

	Vector2: (value, rem) => {
		return new Vector2(value.X * rem, value.Y * rem);
	},

	number: (value, rem) => {
		return value * rem;
	},
};

export function useRem(options?: RemOptions): <T>(value: T) => T;

export function useRem(options?: RemOptions) {
	const rem = useRemContext(options);

	return useCallback(
		(value: never) => {
			const scale = scaleFunctions[typeOf(value)];
			return scale ? scale(value, rem) : value;
		},
		[rem],
	);
}

function useRemContext({ minimum, maximum }: RemOptions = {}) {
	let rem = useContext(RemContext);
	if (minimum !== undefined) rem = math.max(rem, minimum);
	if (maximum !== undefined) rem = math.min(rem, maximum);
	return rem;
}
