import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { Text } from "client/app/common/text";
import { useRem } from "client/app/hooks";
import { $git } from "rbxts-transform-debug";
import { palette } from "shared/data/palette";

interface HomeVersionProps {
	readonly anchorPoint: Vector2;
	readonly position: UDim2;
}

const GIT = $git();
const VERSION = GIT.LatestTag !== "" ? GIT.LatestTag : "v0.1.0";
const REPOSITORY = "littensy/roblox-slither";
const DIVIDER = "—";

export function HomeVersion({ anchorPoint, position }: HomeVersionProps) {
	const rem = useRem();

	return (
		<Group anchorPoint={anchorPoint} position={position} size={new UDim2()}>
			<uilistlayout
				FillDirection="Horizontal"
				VerticalAlignment="Center"
				HorizontalAlignment="Center"
				Padding={new UDim(0, rem(0.8))}
			/>

			<Text
				font="Inter"
				fontWeight={Enum.FontWeight.Medium}
				text={VERSION}
				testAutoResize="X"
				textColor={palette.text}
				textTransparency={0.5}
				textSize={rem(1.1)}
			/>

			<Text
				font="Inter"
				fontWeight={Enum.FontWeight.Bold}
				text={DIVIDER}
				testAutoResize="X"
				textColor={palette.text}
				textTransparency={0.75}
				textSize={rem(1.1)}
			/>

			<Text
				font="Inter"
				fontWeight={Enum.FontWeight.Medium}
				text={REPOSITORY}
				testAutoResize="X"
				textColor={palette.text}
				textTransparency={0.5}
				textSize={rem(1.1)}
			/>
		</Group>
	);
}
