import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { AwesomeButton } from "client/app/common/awesome-button";
import { Text } from "client/app/common/text";
import { useRem, useStore } from "client/app/hooks";
import { fonts } from "client/app/utils/fonts";
import { selectMusicEnabled } from "client/store/menu";
import { palette } from "shared/data/palette";

interface MuteButtonProps {
	readonly anchorPoint: Vector2;
	readonly size: UDim2;
	readonly position: UDim2;
}

export function MuteButton({ anchorPoint, size, position }: MuteButtonProps) {
	const rem = useRem();
	const store = useStore();
	const musicEnabled = useSelector(selectMusicEnabled);

	return (
		<AwesomeButton
			onClick={() => store.setMenuMusic(!musicEnabled)}
			overlayGradient={new ColorSequence(musicEnabled ? palette.blue : palette.maroon)}
			overlayTransparency={0.5}
			anchorPoint={anchorPoint}
			size={size}
			position={position}
		>
			<Text
				key="caption"
				font={fonts.inter.medium}
				text={musicEnabled ? "🔊" : "🔇"}
				textSize={rem(2)}
				size={new UDim2(1, 0, 1, 0)}
			/>
		</AwesomeButton>
	);
}
