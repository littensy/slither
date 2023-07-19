/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { getSnake } from "server/world";
import { connectCandyWorker, createCandy, onCandyTick } from "server/world/workers/candy-worker";
import { WORLD_MAX_CANDY } from "shared/constants";
import { selectCandyById, selectStaticCandies, selectStaticCandyCount } from "shared/store/candy";

export = () => {
	let worker: (() => void) | undefined;

	const countCandy = () => {
		return store.getState(selectStaticCandyCount);
	};

	const didEatCandy = (id: string) => {
		const candy = store.getState(selectCandyById(id));
		return !candy || candy.eatenAt !== undefined;
	};

	beforeEach(() => {
		store.resetState();
		worker = connectCandyWorker();
	});

	afterEach(() => {
		worker?.();
		store.resetState();
	});

	it("should populate the state with candy", () => {
		expect(countCandy()).to.equal(WORLD_MAX_CANDY);
	});

	it("should create new candy when the amount decreases", () => {
		const candies = store.getState(selectStaticCandies);
		const candiesToRemove = new Set(candies.move(0, 5, 0, []));

		for (const candy of candiesToRemove) {
			store.removeCandy(candy.id);
		}

		expect(countCandy()).to.equal(WORLD_MAX_CANDY - candiesToRemove.size());
		store.flush();

		const newCandies = store.getState(selectStaticCandies);
		expect(countCandy()).to.equal(WORLD_MAX_CANDY);
		expect(newCandies.every((candy) => !candiesToRemove.has(candy))).to.equal(true);
	});

	it("should not create new candy when the amount increases", () => {
		const [template] = store.getState(selectStaticCandies);

		for (const index of $range(1, 10)) {
			store.addCandy({ ...template, id: `__test__${index}` });
		}

		expect(countCandy()).to.equal(WORLD_MAX_CANDY + 10);
		store.flush();
		expect(countCandy()).to.equal(WORLD_MAX_CANDY + 10);
	});

	it("should create candy when a snake dies", () => {
		store.addSnake("__test__");
		store.snakeTick(0);
		store.flush();
		store.setSnakeIsDead("__test__");
		store.flush();
	});

	it("should keep candy population at the max if a snake dies", () => {
		const initialCandy = store.getState(selectStaticCandies);

		store.addSnake("__test__");
		store.snakeTick(0);
		store.flush();
		store.setSnakeIsDead("__test__");
		store.flush();

		expect(countCandy() > WORLD_MAX_CANDY).to.equal(true);

		for (const index of $range(1, 50)) {
			const candy = initialCandy[index];
			store.removeCandy(candy.id);
		}

		store.flush();

		expect(countCandy() > WORLD_MAX_CANDY).to.equal(true);
	});

	it("should eat candy when a snake is close", () => {
		const candy = createCandy({ size: 10, position: new Vector2(1000, 1000) });
		store.addCandy(candy);
		store.addSnake("__test__", { head: new Vector2(1000, 1000.5) });
		store.flush();
		onCandyTick();
		expect(didEatCandy(candy.id)).to.equal(true);
		expect(getSnake("__test__")!.score).to.never.equal(0);
	});

	it("should not eat candy if a snake is far away", () => {
		const candy = createCandy({ size: 10, position: Vector2.zero });
		store.addCandy(candy);
		store.addSnake("__test__", { head: new Vector2(100, 100) });
		store.flush();
		onCandyTick();
		expect(didEatCandy(candy.id)).to.equal(false);
	});
};
