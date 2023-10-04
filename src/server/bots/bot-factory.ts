import { store } from "server/store";
import { getSafePointInWorld } from "server/world/utils";
import { getRandomBaseSnakeSkin } from "shared/constants/skins";
import { selectSnakeCount, selectSnakeIsDead } from "shared/store/snakes";

import { BotBehavior } from "./bot-behavior";
import { generateBotName } from "./bot-names";

const MIN_SNAKES = 25;

let nextBotId = 0;

export function initBotFactory() {
	store.subscribe(
		selectSnakeCount,
		(count) => count < MIN_SNAKES,
		(count) => createBots(MIN_SNAKES - count),
	);

	createBots(MIN_SNAKES);
}

export function createBots(amount: number) {
	for (const _ of $range(0, amount)) {
		createBot();
	}
}

export function createBot() {
	const id = `bot-${nextBotId++}`;
	const name = generateBotName();
	const behavior = new BotBehavior(id);

	store.addSnake(id, {
		name,
		head: getSafePointInWorld(),
		skin: getRandomBaseSnakeSkin().id,
	});

	store.once(selectSnakeIsDead(id), () => {
		behavior.destroy();
	});

	return id;
}
