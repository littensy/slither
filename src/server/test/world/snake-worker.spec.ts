/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { getSnake } from "server/world";
import { onSnakeTick } from "server/world/workers/snake-worker";

export = () => {
	it("should update snake target angle", () => {
		store.addSnake("__test__");
		store.turnSnake("__test__", 1);
		expect(getSnake("__test__")?.desiredAngle).to.equal(1);
	});

	it("should update snake boost", () => {
		store.addSnake("__test__");
		store.boostSnake("__test__", true);
		expect(getSnake("__test__")?.boost).to.equal(true);
	});

	it("should step snake physics", () => {
		store.addSnake("__test__");
		onSnakeTick();
		const snake = getSnake("__test__")!;
		expect(snake.head).to.never.equal(Vector2.zero);
		expect(snake.tracers.size()).to.never.equal(0);
	});

	it("should not move dead snakes", () => {
		store.addSnake("__test__", { dead: true });
		onSnakeTick();
		const initialSnake = getSnake("__test__")!;
		onSnakeTick();
		const finalSnake = getSnake("__test__")!;
		expect(initialSnake.head).to.equal(finalSnake.head);
	});
};
