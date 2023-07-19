import { Players } from "@rbxts/services";
import { store } from "server/store";
import { killSnake } from "server/world/utils/snake-utils";
import { connectSnakeInputs, consumeNextSnakeInputs, nextSnakeInputs } from "./snake-inputs";

export function connectSnakeWorker() {
	Players.PlayerRemoving.Connect((player) => {
		nextSnakeInputs.delete(player.Name);
		killSnake(player.Name);
	});

	connectSnakeInputs();
}

export function onSnakeTick() {
	consumeNextSnakeInputs();
	store.snakeTick();
}
