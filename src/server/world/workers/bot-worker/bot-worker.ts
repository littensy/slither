import { store } from "server/store";
import { selectSnakeCount } from "shared/store/snakes";
import { spawnBots } from "./spawn-bots";

const MIN_SNAKES = 10;

export function connectBotWorker() {
	store.subscribe(
		selectSnakeCount,
		(count) => count < MIN_SNAKES,
		(count) => spawnBots(MIN_SNAKES - count),
	);

	spawnBots(MIN_SNAKES);
}
