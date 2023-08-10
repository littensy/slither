import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";

import { MIN_NAV_REM } from "./constants";
import { Destination } from "./destination";
import { Indicator } from "./indicator";
import { useEdge } from "./use-edge";

export function Navigation() {
	const rem = useRem({ minimum: MIN_NAV_REM });
	const edge = useEdge();

	return (
		<Group
			anchorPoint={new Vector2(0, edge === "top" ? 0 : 1)}
			size={new UDim2(1, 0, 0, rem(7.5))}
			position={new UDim2(0, 0, edge === "top" ? 0 : 1, 0)}
		>
			<Indicator
				key="indicator"
				colors={[palette.red, palette.mauve, palette.blue]}
				order={["support", "home", "skins"]}
				edge={edge}
			/>

			<Group
				key="destinations"
				size={new UDim2(1, 0, 0, rem(5))}
				position={new UDim2(0, 0, 0, edge === "top" ? rem(3) : rem(0))}
			>
				<uilistlayout
					key="layout"
					SortOrder="LayoutOrder"
					FillDirection="Horizontal"
					VerticalAlignment="Center"
					HorizontalAlignment="Center"
					Padding={new UDim(0, rem(1))}
				/>

				<Destination
					key="support"
					page="support"
					label="Support"
					color={palette.red}
					icon={images.ui.nav_heart}
					iconAlt={images.ui.nav_heart_alt}
					order={0}
				/>

				<Destination
					key="home"
					page="home"
					label="Home"
					color={palette.mauve}
					icon={images.ui.nav_home}
					iconAlt={images.ui.nav_home_alt}
					order={1}
				/>

				<Destination
					key="skins"
					page="skins"
					label="Skins"
					color={palette.blue}
					icon={images.ui.nav_flower}
					iconAlt={images.ui.nav_flower_alt}
					order={2}
				/>
			</Group>
		</Group>
	);
}
