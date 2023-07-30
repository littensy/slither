import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getRandomPointInWorld, getSafePointInWorld, getSnake } from "server/world/utils";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { selectSnakeIsDead } from "shared/store/snakes";
import { generateBotName } from "./generate-name";
import { BehaviorMode, BotBehavior } from "./bot-behavior";

let nextBotId = 0;

export function createBots(amount: number) {
	for (const _ of $range(0, amount)) {
		createBot();
	}
}

export function createBot() {
	const id = `bot-${nextBotId++}`;
	const name = generateBotName();
	const behavior = new BotBehavior(BehaviorMode.Idle);

	store.addSnake(id, {
		name,
		head: getSafePointInWorld(),
		skin: getRandomDefaultSnakeSkin().id,
	});

	const clearMovement = setInterval(() => {
		behavior.update(id);
	}, 1);

	store.once(selectSnakeIsDead(id), () => {
		clearMovement();
	});

	return id;
}
