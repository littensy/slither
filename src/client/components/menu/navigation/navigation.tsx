import Roact from "@rbxts/roact";
import { Group } from "client/common/group";
import { useRem } from "client/hooks";
import { images } from "shared/assets";
import { palette } from "shared/constants/palette";

import { Destination } from "./destination";
import { Indicator } from "./indicator";

export function Navigation() {
	const rem = useRem();

	let index = 0;

	return (
		<Group size={new UDim2(1, 0, 0, rem(7.5))}>
			<Indicator
				key="indicator"
				colors={[palette.red, palette.mauve, palette.blue]}
				order={["support", "home", "skins"]}
			/>

			<Group key="destinations" size={new UDim2(1, 0, 0, rem(5))} position={new UDim2(0, 0, 0, rem(3))}>
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
					order={index++}
				/>

				<Destination
					key="home"
					page="home"
					label="Home"
					color={palette.mauve}
					icon={images.ui.nav_home}
					iconAlt={images.ui.nav_home_alt}
					order={index++}
				/>

				<Destination
					key="skins"
					page="skins"
					label="Skins"
					color={palette.blue}
					icon={images.ui.nav_skins}
					iconAlt={images.ui.nav_skins_alt}
					order={index++}
				/>
			</Group>
		</Group>
	);
}
