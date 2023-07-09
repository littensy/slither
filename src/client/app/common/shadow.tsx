import { mapBinding } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useRem } from "../hooks";
import { BASE_REM, scale } from "../providers/rem-provider";
import { Image } from "./image";

interface ShadowProps {
	shadowBlur: ShadowBlurSize;
	shadowOffset?: number | Roact.Binding<number>;
	shadowSize?: number | UDim2 | Roact.Binding<number | UDim2>;
	shadowColor?: Color3 | Roact.Binding<Color3>;
	shadowTransparency?: number | Roact.Binding<number>;
	shadowScale?: number;
	zIndex?: number;
}

export type ShadowBlurSize = "150" | "100" | "75" | "50";

const BASE_IMAGE_SIZE = 143;

export function Shadow({
	shadowBlur,
	shadowOffset = 4,
	shadowSize = 0,
	shadowColor = new Color3(),
	shadowTransparency = 0.5,
	shadowScale = 1,
	zIndex = -1,
}: ShadowProps) {
	const rem = useRem();
	const sizeOffset = (tonumber(shadowBlur) ?? 100) * 2;
	const imageSize = BASE_IMAGE_SIZE + sizeOffset;

	return (
		<Image
			image={`blur_${shadowBlur}`}
			imageTransparency={shadowTransparency}
			imageColor={shadowColor}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={mapBinding(shadowSize, (size) => {
				const sizeOffsetScaled = sizeOffset * shadowScale;

				if (typeIs(size, "UDim2")) {
					return new UDim2(1, scale(sizeOffsetScaled, rem), 1, scale(sizeOffsetScaled, rem)).add(size);
				} else {
					return new UDim2(1, size + scale(sizeOffsetScaled, rem), 1, size + scale(sizeOffsetScaled, rem));
				}
			})}
			position={mapBinding(shadowOffset, (offset) => new UDim2(0.5, 0, 0.5, offset))}
			scaleType="Slice"
			sliceCenter={new Rect(imageSize / 2, imageSize / 2, imageSize / 2, imageSize / 2)}
			sliceScale={(rem / BASE_REM) * shadowScale}
			zIndex={zIndex}
		/>
	);
}
