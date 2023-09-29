import { useThrottleCallback } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { AwesomeButton } from "client/app/common/awesome-button";
import { Text } from "client/app/common/text";
import { useRem, useStore } from "client/app/hooks";
import { fonts } from "client/app/utils/fonts";
import { selectWorldSpectating } from "client/store/world";
import { palette } from "shared/data/palette";
import { cycleNextSnake } from "shared/store/snakes";

export function SpectateButton() {
	const rem = useRem();
	const store = useStore();
	const spectating = useSelector(selectWorldSpectating);

	const onClick = useThrottleCallback(
		() => {
			store.setWorldSpectating(store.getState(cycleNextSnake(spectating)));
		},
		{ wait: 0.5, trailing: false },
	);

	return (
		<AwesomeButton
			onClick={onClick.run}
			overlayGradient={new ColorSequence(palette.text)}
			size={new UDim2(0, rem(4), 0, rem(4))}
		>
			<Text key="caption" font={fonts.inter.medium} text="🎥" textSize={rem(2)} size={new UDim2(1, 0, 1, 0)} />
		</AwesomeButton>
	);
}
