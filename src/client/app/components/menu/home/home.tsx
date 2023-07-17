import Roact from "@rbxts/roact";
import { useRem } from "client/app/hooks";
import { HomePlayButton } from "./home-play-button";
import { HomeTitle } from "./home-title";
import { HomeVersion } from "./home-version";

export function Home() {
	const rem = useRem();

	return (
		<>
			<HomeTitle position={new UDim2(0.5, 0, 0.5, rem(-10))} />
			<HomePlayButton
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(18), 0, rem(3.5))}
				position={new UDim2(0.5, 0, 0.5, rem(2))}
			/>
			<HomeVersion anchorPoint={new Vector2(0.5, 0)} position={new UDim2(0.5, 0, 0.5, rem(6))} />
		</>
	);
}
