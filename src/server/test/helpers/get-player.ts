/// <reference types="@rbxts/testez/globals" />

import { Players } from "@rbxts/services";

/**
 * Returns any player in the game if one exists. Skips the test
 * if no player could be found. This should only skip if the
 * test is being run without collaborative editing.
 */
export function getPlayer() {
	const player = Players.FindFirstChildWhichIsA("Player");

	if (!player) {
		SKIP();
	}

	return player!;
}
