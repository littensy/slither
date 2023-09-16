import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { Text } from "client/app/common/text";
import { useRem } from "client/app/hooks";
import { fonts } from "client/app/utils/fonts";
import { $git } from "rbxts-transform-debug";
import { palette } from "shared/data/palette";

interface HomeVersionProps {
	readonly anchorPoint: Vector2;
	readonly position: UDim2;
}

const GIT = $git();
const VERSION = GIT.LatestTag !== "" ? GIT.LatestTag : "workflow_dispatch";
const BRANCH = `@${GIT.Branch}`;

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
				font={fonts.inter.medium}
				text={VERSION}
				textAutoResize="X"
				textColor={palette.text}
				textTransparency={0.5}
				textSize={rem(1.25)}
			/>

			<Divider />

			<Text
				richText
				font={fonts.inter.medium}
				text={BRANCH}
				textAutoResize="X"
				textColor={palette.text}
				textTransparency={0.5}
				textSize={rem(1.25)}
			/>
		</Group>
	);
}

function Divider() {
	const rem = useRem();

	return (
		<Text
			font={fonts.inter.bold}
			text="—"
			textAutoResize="X"
			textColor={palette.text}
			textTransparency={0.75}
			textSize={rem(1.25)}
		/>
	);
}
