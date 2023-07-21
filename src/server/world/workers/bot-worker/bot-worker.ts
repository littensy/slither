import { store } from "server/store";
import { selectSnakeCount } from "shared/store/snakes";
import { createBots } from "./create-bot";

const MIN_SNAKES = 15;

export function connectBotWorker() {
	store.subscribe(
		selectSnakeCount,
		(count) => count < MIN_SNAKES,
		(count) => createBots(MIN_SNAKES - count),
	);

	createBots(MIN_SNAKES);
}
