/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { connectPhysicsWorker } from "server/world/workers/physics-worker";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { selectSnakeById } from "shared/store/snakes";

export = () => {
	let worker: (() => void) | undefined;

	beforeEach(() => {
		store.resetState();
		worker = connectPhysicsWorker();
	});

	afterEach(() => {
		worker?.();
		store.resetState();
	});

	const getSnake = (id: string) => {
		return store.getState(selectSnakeById(id));
	};

	it("should update snake target angle", () => {
		store.addSnake("__test__", "__test__", Vector2.zero, getRandomDefaultSnakeSkin().id);
		store.setSnakeTargetAngle("__test__", 1);
		expect(getSnake("__test__")?.targetAngle).to.equal(1);
	});

	it("should update snake boost", () => {
		store.addSnake("__test__", "__test__", Vector2.zero, getRandomDefaultSnakeSkin().id);
		store.setSnakeBoost("__test__", true);
		expect(getSnake("__test__")?.boost).to.equal(true);
	});

	it("should step snake physics", () => {
		store.addSnake("__test__", "__test__", Vector2.zero, getRandomDefaultSnakeSkin().id);
		store.updateSnakes(0.1);
		const snake = getSnake("__test__")!;
		expect(snake.head).to.never.equal(Vector2.zero);
		expect(snake.segments.size()).to.never.equal(0);
	});
};
