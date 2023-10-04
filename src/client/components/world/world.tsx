import Roact from "@rbxts/roact";
import { Group } from "client/common/group";
import { RemProvider } from "client/providers/rem-provider";

import { Backdrop } from "./backdrop";
import { Candy } from "./candy";
import { Snakes } from "./snakes";
import { WorldBorder } from "./world-border";
import { WorldSounds } from "./world-sounds";
import { WorldSubject } from "./world-subject";

export function World() {
	return (
		<RemProvider minimumRem={6}>
			<Group key="world-layer">
				<Backdrop key="backdrop" />
				<Candy key="candy" />
				<Snakes key="snakes" />
				<WorldSubject key="world-subject" />
				<WorldBorder key="world-border" />
				<WorldSounds key="world-sounds" />
			</Group>
		</RemProvider>
	);
}
