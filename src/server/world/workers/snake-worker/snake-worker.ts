import { Players } from "@rbxts/services";
import { store } from "server/store";
import { killSnake } from "server/world/utils/world-utils";
import { updateSnakeGrid } from "./snake-grid";
import { connectSnakeInputs, consumeNextSnakeInputs, nextSnakeInputs } from "./snake-inputs";

export function connectSnakeWorker() {
	const playerRemoving = Players.PlayerRemoving.Connect((player) => {
		nextSnakeInputs.delete(player.Name);
		killSnake(player.Name);
	});

	const inputHandle = connectSnakeInputs();

	return () => {
		playerRemoving.Disconnect();
		inputHandle();
	};
}

export function onSnakeTick() {
	consumeNextSnakeInputs();
	store.snakeTick();
	updateSnakeGrid();
}
