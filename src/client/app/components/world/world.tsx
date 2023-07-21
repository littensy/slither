import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { Backdrop } from "./backdrop";
import { Candy } from "./candy";
import { WorldBorder } from "./world-border";
import { WorldSnakes } from "./world-snakes";
import { WorldSubject } from "./world-subject";

export function World() {
	return (
		<Group>
			<Backdrop />
			<Candy />
			<WorldSubject />
			<WorldSnakes />
			<WorldBorder />
		</Group>
	);
}
