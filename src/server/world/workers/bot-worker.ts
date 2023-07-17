import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { selectSnakeById, selectSnakeCount, selectSnakeIsDead } from "shared/store/snakes";
import { getRandomPointInWorld, getSafePointInWorld } from "../utils";

const MIN_SNAKES = 10;

let nextBotId = 0;

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
		spawnBot();
	}
}

function spawnBot() {
	const id = `bot-${nextBotId++}`;

	store.addSnake(id, id, getSafePointInWorld(), getRandomDefaultSnakeSkin().id);

	const clearMovement = setInterval(() => {
		const point = getRandomPointInWorld(0.8);
		const snake = store.getState(selectSnakeById(id));

		if (!snake) {
			return;
		}

		const angle = math.atan2(point.Y - snake.head.Y, point.X - snake.head.X);
		store.setSnakeTargetAngle(id, angle);
	}, 1);

	store.once(selectSnakeIsDead(id), () => {
		clearMovement();
	});
}
