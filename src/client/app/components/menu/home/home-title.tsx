import { useTimer } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { Image } from "client/app/common/image";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";
import { GRADIENT } from "./utils";

interface HomeTitleProps {
	readonly position: UDim2;
}

export function HomeTitle({ position }: HomeTitleProps) {
	const rem = useRem();
	const timer = useTimer();
	const rotation = timer.value.map((t) => (t * 45) % 360);

	return (
		<Group anchorPoint={new Vector2(0.5, 0.5)} position={position}>
			<uilistlayout FillDirection="Horizontal" VerticalAlignment="Center" HorizontalAlignment="Center" />

			<Image image={images.ui.menu_title_slither} scaleType="Fit" size={new UDim2(0, rem(22), 0, rem(14))}>
				<uigradient Color={GRADIENT} Rotation={rotation} />
			</Image>

			<Image
				image={images.ui.menu_title_blox}
				imageColor={palette.text}
				imageTransparency={0.1}
				scaleType="Fit"
				size={new UDim2(0, rem(16), 0, rem(14))}
			/>
		</Group>
	);
}
