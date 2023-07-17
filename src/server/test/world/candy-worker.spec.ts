/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { connectCandyWorker, createCandy, onCandyTick } from "server/world/workers/candy-worker";
import { WORLD_MAX_CANDY } from "shared/constants";
import { selectCandyById, selectStaticCandies, selectStaticCandyCount } from "shared/store/candy";
import { selectSnakeById } from "shared/store/snakes";

export = () => {
	let worker: (() => void) | undefined;

	beforeEach(() => {
		store.resetState();
		worker = connectCandyWorker();
	});

	afterEach(() => {
		worker?.();
		store.resetState();
	});

	const countCandy = () => {
		return store.getState(selectStaticCandyCount);
	};

	const didEatCandy = (id: string) => {
		const candy = store.getState(selectCandyById(id));
		return !candy || candy.eatenAt !== undefined;
	};

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
		store.addSnake("__test__", "__test__", Vector2.zero, "");
		store.updateSnakes(0);
		store.flush();
		store.setSnakeDead("__test__");
		store.flush();
	});

	it("should keep candy population at the max if a snake dies", () => {
		const initialCandy = store.getState(selectStaticCandies);

		store.addSnake("__test__", "__test__", Vector2.zero, "");
		store.updateSnakes(0);
		store.flush();
		store.setSnakeDead("__test__");
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
		const candy = createCandy(10, new Vector2(1000, 1000));
		store.addCandy(candy);
		store.addSnake("__test__", "__test__", new Vector2(1000, 1000.5), "");
		store.flush();
		onCandyTick();
		expect(didEatCandy(candy.id)).to.equal(true);
		expect(store.getState(selectSnakeById("__test__"))!.score).to.never.equal(0);
	});

	it("should not eat candy if a snake is far away", () => {
		const candy = createCandy(10, Vector2.zero);
		store.addCandy(candy);
		store.addSnake("__test__", "__test__", new Vector2(100, 100), "");
		store.flush();
		onCandyTick();
		expect(didEatCandy(candy.id)).to.equal(false);
	});
};
