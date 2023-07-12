import { mapBinding } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { images } from "shared/assets";
import { useRem } from "../hooks";
import { BASE_REM, scale } from "../providers/rem-provider";
import { Image } from "./image";

interface ShadowProps {
	shadowBlur?: number;
	shadowOffset?: number | Roact.Binding<number>;
	shadowSize?: number | UDim2 | Roact.Binding<number | UDim2>;
	shadowColor?: Color3 | Roact.Binding<Color3>;
	shadowTransparency?: number | Roact.Binding<number>;
	zIndex?: number;
}

const IMAGE_SIZE = new Vector2(512, 512);
const BLUR_RADIUS = 160;

export function Shadow({
	shadowBlur = 1,
	shadowOffset = 4,
	shadowSize = 0,
	shadowColor = new Color3(),
	shadowTransparency = 0.5,
	zIndex = -1,
}: ShadowProps) {
	const rem = useRem();

	return (
		<Image
			image={images.common.blur}
			imageTransparency={shadowTransparency}
			imageColor={shadowColor}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={mapBinding(shadowSize, (size) => {
				const sizeOffsetScaled = BLUR_RADIUS * shadowBlur;

				if (typeIs(size, "UDim2")) {
					return new UDim2(1, scale(sizeOffsetScaled, rem), 1, scale(sizeOffsetScaled, rem)).add(size);
				} else {
					return new UDim2(1, size + scale(sizeOffsetScaled, rem), 1, size + scale(sizeOffsetScaled, rem));
				}
			})}
			position={mapBinding(shadowOffset, (offset) => new UDim2(0.5, 0, 0.5, offset))}
			scaleType="Slice"
			sliceCenter={new Rect(IMAGE_SIZE.div(2), IMAGE_SIZE.div(2))}
			sliceScale={(rem / BASE_REM) * shadowBlur}
			zIndex={zIndex}
		/>
	);
}
