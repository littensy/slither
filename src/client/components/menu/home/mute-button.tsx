import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { AwesomeButton } from "client/components/ui/awesome-button";
import { Text } from "client/components/ui/text";
import { useRem, useStore } from "client/hooks";
import { selectMusicEnabled } from "client/store/menu";
import { fonts } from "client/utils/fonts";
import { palette } from "shared/constants/palette";

export function MuteButton() {
	const rem = useRem();
	const store = useStore();
	const musicEnabled = useSelector(selectMusicEnabled);

	return (
		<AwesomeButton
			onClick={() => store.setMenuMusic(!musicEnabled)}
			overlayGradient={new ColorSequence(musicEnabled ? palette.text : palette.maroon)}
			size={new UDim2(0, rem(4), 0, rem(4))}
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
