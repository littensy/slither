import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { RemProvider } from "client/app/providers/rem-provider";
import { Backdrop } from "./backdrop";
import { Candy } from "./candy";
import { WorldBorder } from "./world-border";
import { WorldSnakes } from "./world-snakes";
import { WorldSubject } from "./world-subject";

export function World() {
	return (
		<RemProvider minimumRem={6}>
			<Group>
				<Backdrop />
				<Candy />
				<WorldSubject />
				<WorldSnakes />
				<WorldBorder />
			</Group>
		</RemProvider>
	);
}
