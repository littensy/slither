/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { handleCollisionUpdate } from "server/world/workers/collision-worker";
import { selectSnakeById } from "shared/store/snakes";

export = () => {
	beforeEach(() => {
		store.resetState();
	});

	afterEach(() => {
		store.resetState();
	});

	it("should kill snake on collision", () => {
		store.addSnake("__test1__", "", new Vector2(0, 0), "");
		store.addSnake("__test2__", "", new Vector2(100, 100), "");
		store.updateSnakes(0);
		store.patchSnake("__test1__", { head: new Vector2(100.1, 100) });
		handleCollisionUpdate();
		const snake1 = store.getState(selectSnakeById("__test1__"));
		const snake2 = store.getState(selectSnakeById("__test2__"));
		expect(snake1?.dead).to.equal(true);
		expect(snake2?.dead).to.equal(false);
	});

	it("should not kill snake on self-collision", () => {
		store.addSnake("__test__", "", new Vector2(0, 0), "");
		store.updateSnakes(0);
		handleCollisionUpdate();
		const snake = store.getState(selectSnakeById("__test__"));
		expect(snake?.dead).to.equal(false);
	});

	it("should not kill snake when not colliding", () => {
		store.addSnake("__test1__", "", new Vector2(0, 0), "");
		store.addSnake("__test2__", "", new Vector2(100, 100), "");
		store.updateSnakes(0);
		handleCollisionUpdate();
		const snake1 = store.getState(selectSnakeById("__test1__"));
		const snake2 = store.getState(selectSnakeById("__test2__"));
		expect(snake1?.dead).to.equal(false);
		expect(snake2?.dead).to.equal(false);
	});

	it("should not kill snake when collided with dead snake", () => {
		store.addSnake("__test1__", "", new Vector2(100.1, 100), "");
		store.addSnake("__test2__", "", new Vector2(100, 100), "");
		store.updateSnakes(0);
		store.patchSnake("__test2__", { dead: true });
		handleCollisionUpdate();
		const snake1 = store.getState(selectSnakeById("__test1__"));
		const snake2 = store.getState(selectSnakeById("__test2__"));
		expect(snake1?.dead).to.equal(false);
		expect(snake2?.dead).to.equal(true);
	});
};
