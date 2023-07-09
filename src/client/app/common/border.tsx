import { joinAnyBindings, mapBinding } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo } from "@rbxts/roact";
import { Frame } from "./frame";

interface BorderProps extends Roact.PropsWithChildren {
	borderMode?: BorderMode;
	borderColor?: Color3 | Roact.Binding<Color3>;
	borderThickness?: number | Roact.Binding<number>;
	borderTransparency?: number | Roact.Binding<number>;
	borderRadius?: UDim | Roact.Binding<UDim>;
}

export type BorderMode = "inside" | "outside" | "center";

function roundEven(x: number) {
	return math.round(x / 2) * 2;
}

export function Border({
	borderMode = "outside",
	borderColor = Color3.fromRGB(255, 255, 255),
	borderThickness = 1,
	borderTransparency = 0,
	borderRadius = new UDim(),
	children,
}: BorderProps) {
	const borderOffset = useMemo(() => {
		// By default, all UIStroke effects are outer borders. To center or make
		// an inner border, we need to offset the border by half the thickness.
		if (borderMode === "outside") {
			return new UDim2(1, 0, 1, 0);
		} else if (borderMode === "inside") {
			return mapBinding(borderThickness, (px) => new UDim2(1, roundEven(-2 * px), 1, roundEven(-2 * px)));
		} else if (borderMode === "center") {
			return mapBinding(borderThickness, (px) => new UDim2(1, roundEven(-px), 1, roundEven(-px)));
		}
	}, [borderThickness, borderMode]);

	const borderCornerRadius = useMemo(() => {
		const binding = joinAnyBindings([borderRadius, borderThickness] as const);

		// Offsetting the border container means that the corner size will not
		// match up with the container's corner size. To fix this, we need to
		// adjust the corner size by the offset.
		if (borderMode === "outside") {
			return borderRadius;
		} else if (borderMode === "inside") {
			return binding.map(([radius, thickness]) => radius.sub(new UDim(0, thickness)));
		} else if (borderMode === "center") {
			return binding.map(([radius, thickness]) => radius.sub(new UDim(0, thickness)));
		}
	}, [borderRadius, borderThickness, borderMode]);

	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			size={borderOffset}
			position={new UDim2(0.5, 0, 0.5, 0)}
			cornerRadius={borderCornerRadius}
			backgroundTransparency={1}
		>
			<uistroke Color={borderColor} Transparency={borderTransparency} Thickness={borderThickness}>
				{children}
			</uistroke>
		</Frame>
	);
}
