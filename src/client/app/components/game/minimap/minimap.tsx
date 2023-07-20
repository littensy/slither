import Roact from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { Group } from "client/app/common/group";
import { Image } from "client/app/common/image";
import { Shadow } from "client/app/common/shadow";
import { useRem } from "client/app/hooks";
import { BASE_REM } from "client/app/providers/rem-provider";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";
import { MinimapNodes } from "./minimap-nodes";

export function Minimap() {
	const rem = useRem();

	return (
		<Group
			anchorPoint={new Vector2(1, 1)}
			size={new UDim2(0, rem(10), 0, rem(10))}
			position={new UDim2(1, rem(-3), 1, rem(-3))}
		>
			<Shadow
				key="drop-shadow"
				shadowColor={palette.black}
				shadowSize={rem(5)}
				shadowOffset={rem(1.5)}
				shadowTransparency={0}
			/>

			<Frame
				key="background"
				backgroundColor={palette.white1}
				cornerRadius={new UDim(1, 0)}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uigradient
					Color={new ColorSequence(palette.crust, palette.mantle)}
					Transparency={new NumberSequence(0.3, 0.1)}
					Rotation={-45}
				/>
				<uistroke Color={palette.lavender} Transparency={0.9} Thickness={rem(0.25)} />
			</Frame>

			<Frame
				key="inner-stroke"
				backgroundTransparency={1}
				cornerRadius={new UDim(1, 0)}
				size={new UDim2(1, -2, 1, -2)}
				position={new UDim2(0, 1, 0, 1)}
			>
				<uistroke Color={palette.text} Transparency={0.85} Thickness={rem(0.05)} />
			</Frame>

			<Image
				key="crosshair"
				image={images.ui.map_crosshair}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(16 / BASE_REM), 0, rem(16 / BASE_REM))}
				position={new UDim2(0.5, 0, 0.5, 0)}
			/>

			<MinimapNodes />
		</Group>
	);
}
