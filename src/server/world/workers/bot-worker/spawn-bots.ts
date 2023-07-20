import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getRandomPointInWorld, getSafePointInWorld } from "server/world/utils/spawn-utils";
import { getSnake } from "server/world/utils/world-utils";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { selectSnakeIsDead } from "shared/store/snakes";

let nextBotId = 0;

export function spawnBots(amount: number) {
	for (const _ of $range(0, amount)) {
		spawnBot();
	}
}

function spawnBot() {
	const id = `bot-${nextBotId++}`;

	store.addSnake(id, {
		name: id,
		head: getSafePointInWorld(),
		skin: getRandomDefaultSnakeSkin().id,
	});

	const clearMovement = setInterval(() => {
		const snake = getSnake(id);

		if (!snake) {
			return;
		}

		const from = snake.head;
		const to = getRandomPointInWorld(0.8);
		const angle = math.atan2(to.Y - from.Y, to.X - from.X);

		store.turnSnake(id, angle);
	}, 1);

	store.once(selectSnakeIsDead(id), () => {
		clearMovement();
	});
}
