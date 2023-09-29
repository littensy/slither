import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";

import { HomeFooter } from "./home-footer";
import { HomeTitle } from "./home-title";
import { HomeVersion } from "./home-version";
import { MuteButton } from "./mute-button";
import { PlayButton } from "./play-button";
import { SpectateButton } from "./spectate-button";

export function Home() {
	const rem = useRem();

	return (
		<>
			<HomeTitle position={new UDim2(0.5, 0, 0.4, rem(-3))} />
			<HomeVersion position={new UDim2(0.5, 0, 0.5, rem(6.5))} />
			<HomeFooter />

			<PlayButton
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(18), 0, rem(4.5))}
				position={new UDim2(0.5, 0, 0.5, rem(2))}
			/>

			<Group anchorPoint={new Vector2(1, 1)} size={new UDim2()} position={new UDim2(1, rem(-3), 1, rem(-3))}>
				<uilistlayout
					Padding={new UDim(0, rem(1))}
					VerticalAlignment="Bottom"
					HorizontalAlignment="Right"
					FillDirection="Horizontal"
				/>
				<MuteButton />
				<SpectateButton />
			</Group>
		</>
	);
}
