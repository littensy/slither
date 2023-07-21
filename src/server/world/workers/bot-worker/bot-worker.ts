import { store } from "server/store";
import { selectSnakeCount } from "shared/store/snakes";
import { createBot } from "./create-bot";

const MIN_SNAKES = 15;

export function connectBotWorker() {
	store.subscribe(
		selectSnakeCount,
		(count) => count < MIN_SNAKES,
		(count) => spawnBots(MIN_SNAKES - count),
	);

	spawnBots(MIN_SNAKES);
}

function spawnBots(amount: number) {
	for (const _ of $range(0, amount)) {
		createBot();
	}
}
