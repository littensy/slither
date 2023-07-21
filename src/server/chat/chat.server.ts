import { store } from "server/store";
import { createCommand } from "./create-command";

createCommand("/score", (player, argument) => {
	const score = tonumber(argument);
	store.patchSnake(player.Name, { score });
});
