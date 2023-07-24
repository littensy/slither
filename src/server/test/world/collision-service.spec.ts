/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { getSnake } from "server/world";
import { onCollisionTick } from "server/world/services/collision-service";
import { onSnakeTick } from "server/world/services/snake-service";
import { WORLD_BOUNDS } from "shared/constants";

export = () => {
	it("should kill snake on collision", () => {
		store.addSnake("__test1__", { head: new Vector2(0, 0) });
		store.addSnake("__test2__", { head: new Vector2(100, 100) });
		onSnakeTick();
		store.patchSnake("__test1__", { head: new Vector2(100.1, 100) });
		onCollisionTick();
		const snake1 = getSnake("__test1__");
		const snake2 = getSnake("__test2__");
		expect(snake1?.dead).to.equal(true);
		expect(snake2?.dead).to.equal(false);
	});

	it("should not kill snake on self-collision", () => {
		store.addSnake("__test__", { head: new Vector2(0, 0) });
		onSnakeTick();
		onCollisionTick();
		const snake = getSnake("__test__");
		expect(snake?.dead).to.equal(false);
	});

	it("should not kill snake when not colliding", () => {
		store.addSnake("__test1__", { head: new Vector2(0, 0) });
		store.addSnake("__test2__", { head: new Vector2(100, 100) });
		onSnakeTick();
		onCollisionTick();
		const snake1 = getSnake("__test1__");
		const snake2 = getSnake("__test2__");
		expect(snake1?.dead).to.equal(false);
		expect(snake2?.dead).to.equal(false);
	});

	it("should not kill snake when collided with dead snake", () => {
		store.addSnake("__test1__", { head: new Vector2(100.1, 100) });
		store.addSnake("__test2__", { head: new Vector2(100, 100) });
		onSnakeTick();
		store.patchSnake("__test2__", { dead: true });
		onCollisionTick();
		const snake1 = getSnake("__test1__");
		const snake2 = getSnake("__test2__");
		expect(snake1?.dead).to.equal(false);
		expect(snake2?.dead).to.equal(true);
	});

	it("should kill snakes out of bounds", () => {
		store.addSnake("__test__", { head: new Vector2(0, WORLD_BOUNDS + 1) });
		expect(getSnake("__test__")?.dead).to.equal(false);
		onCollisionTick();
		expect(getSnake("__test__")?.dead).to.equal(true);
	});
};
