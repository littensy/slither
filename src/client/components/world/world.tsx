import React from "@rbxts/react";
import { Group } from "client/components/ui/group";
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
			<Group>
				<Backdrop />
				<Candy />
				<Snakes />
				<WorldSubject />
				<WorldBorder />
				<WorldSounds />
			</Group>
		</RemProvider>
	);
}
