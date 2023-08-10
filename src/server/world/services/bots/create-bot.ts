import { store } from "server/store";
import { getSafePointInWorld } from "server/world/utils";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { selectSnakeIsDead } from "shared/store/snakes";

import { BotBehavior } from "./bot-behavior";
import { generateBotName } from "./generate-name";

let nextBotId = 0;

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
		skin: getRandomDefaultSnakeSkin().id,
	});

	store.once(selectSnakeIsDead(id), () => {
		behavior.destroy();
	});

	return id;
}
