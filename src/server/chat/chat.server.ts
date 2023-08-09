import { store } from "server/store";
import { getSnake, killSnake } from "server/world";
import { createBot } from "server/world/services/bot-service";
import { selectSnakes } from "shared/store/snakes";
import { createCommand } from "./create-command";

createCommand("/score", (player, argument) => {
	const score = tonumber(argument);
	store.patchSnake(player.Name, { score });
});

createCommand("/bot", (player, argument) => {
	const score = tonumber(argument);
	const snake = getSnake(player.Name);
	const id = createBot();
	store.patchSnake(id, {
		score,
		head: snake ? snake.head.add(new Vector2(0, 7)) : undefined,
		angle: math.rad(90),
		desiredAngle: math.rad(90),
	});
});

createCommand("/purge", (player, argument) => {
	let snakes = store.getState(selectSnakes).filter((snake) => {
		return snake.id !== player.Name;
	});

	if (argument.sub(1, 3) === "bot") {
		snakes = snakes.filter((snake) => snake.id.sub(1, 3) === "bot");
	}

	for (const snake of snakes) {
		killSnake(snake.id);
	}
});

createCommand("/money", (player, argument) => {
	const money = tonumber(argument) ?? 0;
	store.givePlayerBalance(player.Name, money);
});
