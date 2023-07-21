import { setInterval } from "@rbxts/set-timeout";
import { store } from "server/store";
import { getRandomPointInWorld, getSafePointInWorld } from "server/world/utils/spawn-utils";
import { getSnake } from "server/world/utils/world-utils";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { selectSnakeIsDead } from "shared/store/snakes";

let nextBotId = 0;

export function createBot() {
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

		// prefer points that are further away
		const goal = maxVector(getRandomPointInWorld(), getRandomPointInWorld());
		const head = snake.head;
		const angle = math.atan2(goal.Y - head.Y, goal.X - head.X);

		store.turnSnake(id, angle);
	}, 1);

	store.once(selectSnakeIsDead(id), () => {
		clearMovement();
	});
}

function maxVector(a: Vector2, b: Vector2) {
	return new Vector2(math.max(a.X, b.X), math.max(a.Y, b.Y));
}
