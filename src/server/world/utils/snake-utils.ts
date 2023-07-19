import { setTimeout } from "@rbxts/set-timeout";
import { store } from "server/store";
import { selectSnakeById } from "shared/store/snakes";

export function getSnake(snakeId: string) {
	return store.getState(selectSnakeById(snakeId));
}

export function killSnake(snakeId: string) {
	store.setSnakeIsDead(snakeId);

	setTimeout(() => {
		store.removeSnake(snakeId);
	}, 2);
}

export function playerIsSpawned(player: Player) {
	return getSnake(player.Name) !== undefined;
}
