import { Players } from "@rbxts/services";
import { store } from "server/store";
import { SNAKE_TICK_PHASE } from "server/world/constants";
import { getSafePointInWorld, killSnake, playerIsSpawned } from "server/world/utils";
import { WORLD_TICK } from "shared/constants/core";
import { remotes } from "shared/remotes";
import { defaultPlayerSave, RANDOM_SKIN, selectPlayerSave } from "shared/store/saves";
import { createScheduler } from "shared/utils/scheduler";

import { deleteSnakeInput, onSnakeTick, registerSnakeInput } from "./snake-tick";

export async function initSnakeService() {
	createScheduler({
		name: "snake",
		tick: WORLD_TICK,
		phase: SNAKE_TICK_PHASE,
		onTick: onSnakeTick,
	});

	remotes.snake.spawn.connect((player) => {
		if (playerIsSpawned(player)) {
			return;
		}

		const save = store.getState(selectPlayerSave(player.Name)) || defaultPlayerSave;

		// random skin starts at one because zero is reserved
		const randomSkin = save.skins[math.random(1, save.skins.size() - 1)];
		const currentSkin = save.skin;

		store.addSnake(player.Name, {
			name: player.DisplayName,
			head: getSafePointInWorld(),
			skin: currentSkin !== RANDOM_SKIN ? currentSkin : randomSkin,
			score: 10,
		});
	});

	remotes.snake.move.connect((player, angle) => {
		registerSnakeInput(player.Name, angle);
	});

	remotes.snake.boost.connect((player, boost) => {
		store.boostSnake(player.Name, boost);
	});

	remotes.snake.kill.connect((player) => {
		killSnake(player.Name);
	});

	Players.PlayerRemoving.Connect((player) => {
		deleteSnakeInput(player.Name);
		killSnake(player.Name);
	});
}
