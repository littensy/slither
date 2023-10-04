import { createBot } from "server/bots";
import { store } from "server/store";
import { getSnake, killSnake } from "server/world";
import { defaultPlayerSave } from "shared/store/saves";
import { selectSnakes } from "shared/store/snakes";

import { createCommand } from "./create-command";

createCommand("/score", (player, argument) => {
	store.patchSnake(player.Name, { score: tonumber(argument) });
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
	store.givePlayerBalance(player.Name, tonumber(argument) ?? 0);
});

createCommand("/force-reset", (player) => {
	store.setPlayerSave(player.Name, defaultPlayerSave);
});
