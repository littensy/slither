import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { Backdrop } from "./backdrop";
import { Candy } from "./candy";
import { WorldBorder } from "./world-border";
import { WorldFocus } from "./world-focus";
import { WorldSnakes } from "./world-snakes";

export function World() {
	return (
		<Group>
			<Backdrop />
			<Candy />
			<WorldFocus />
			<WorldSnakes />
			<WorldBorder />
		</Group>
	);
}
