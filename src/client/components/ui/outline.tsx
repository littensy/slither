import { blend, composeBindings } from "@rbxts/pretty-react-hooks";
import React, { useMemo } from "@rbxts/react";
import { palette } from "shared/constants/palette";

import { useRem } from "../../hooks";
import { Group } from "./group";

interface OutlineProps extends React.PropsWithChildren {
	readonly outlineTransparency?: number | React.Binding<number>;
	readonly innerColor?: Color3 | React.Binding<Color3>;
	readonly outerColor?: Color3 | React.Binding<Color3>;
	readonly innerTransparency?: number | React.Binding<number>;
	readonly outerTransparency?: number | React.Binding<number>;
	readonly innerThickness?: number | React.Binding<number>;
	readonly outerThickness?: number | React.Binding<number>;
	readonly cornerRadius?: UDim | React.Binding<UDim>;
}

function ceilEven(n: number) {
	return math.ceil(n / 2) * 2;
}

export function Outline({
	outlineTransparency = 0,
	innerColor = palette.white,
	outerColor = palette.black,
	innerTransparency = 0.9,
	outerTransparency = 0.85,
	innerThickness,
	outerThickness,
	cornerRadius,
	children,
}: OutlineProps) {
	const rem = useRem();

	innerThickness ??= rem(3, "pixel");
	outerThickness ??= rem(1.5, "pixel");
	cornerRadius ??= new UDim(0, rem(0.5));

	const innerStyle = useMemo(() => {
		const size = composeBindings(innerThickness!, (thickness) => {
			return new UDim2(1, ceilEven(-2 * thickness), 1, ceilEven(-2 * thickness));
		});

		const position = composeBindings(innerThickness!, (thickness) => {
			return new UDim2(0, thickness, 0, thickness);
		});

		const radius = composeBindings(cornerRadius!, innerThickness!, (radius, thickness) => {
			return radius.sub(new UDim(0, thickness));
		});

		const transparency = composeBindings(outlineTransparency, innerTransparency, (a, b) => {
			return math.clamp(blend(a, b), 0, 1);
		});

		return { size, position, radius, transparency };
	}, [innerThickness, innerTransparency, cornerRadius, outlineTransparency, rem]);

	const outerStyle = useMemo(() => {
		const transparency = composeBindings(outlineTransparency, outerTransparency, (a, b) => {
			return math.clamp(blend(a, b), 0, 1);
		});

		return { transparency };
	}, [outlineTransparency, outerTransparency]);

	return (
		<>
			<Group size={innerStyle.size} position={innerStyle.position}>
				<uicorner CornerRadius={innerStyle.radius} />
				<uistroke Color={innerColor} Transparency={innerStyle.transparency} Thickness={innerThickness}>
					{children}
				</uistroke>
			</Group>

			<Group>
				<uicorner CornerRadius={cornerRadius} />
				<uistroke Color={outerColor} Transparency={outerStyle.transparency} Thickness={outerThickness}>
					{children}
				</uistroke>
			</Group>
		</>
	);
}
