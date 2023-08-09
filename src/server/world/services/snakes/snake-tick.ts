import { store } from "server/store";
import { updateSnakeGrid } from "./snake-grid";

const nextSnakeInputs = new Map<string, number>();

export function onSnakeTick() {
	consumeNextSnakeInputs();
	store.snakeTick();
	updateSnakeGrid();
}

export function registerSnakeInput(id: string, angle: number) {
	nextSnakeInputs.set(id, angle);
}

export function deleteSnakeInput(id: string) {
	nextSnakeInputs.delete(id);
}

function consumeNextSnakeInputs() {
	for (const [id, angle] of nextSnakeInputs) {
		store.turnSnake(id, angle);
	}

	nextSnakeInputs.clear();
}
