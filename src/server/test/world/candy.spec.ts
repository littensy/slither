/// <reference types="@rbxts/testez/globals" />

import { store } from "server/store";
import { createCandy, getSnake, onCandyTick, removeCandyIfAtLimit } from "server/world";
import { CANDY_LIMITS } from "shared/constants";
import { CandyType, selectCandies, selectCandyById, selectCandyCount } from "shared/store/candy";
import { fillArray } from "shared/utils/object-utils";

export = () => {
	const countCandy = (candyType?: CandyType) => {
		return store.getState(selectCandyCount(candyType));
	};

	const didEatCandy = (id: string) => {
		const candy = store.getState(selectCandyById(id));
		return !candy || candy.eatenAt !== undefined;
	};

	it("should populate the state with candy", () => {
		expect(countCandy()).to.equal(CANDY_LIMITS[CandyType.Default]);
	});

	it("should create new candy when the amount decreases", () => {
		const candies = store.getState(selectCandies);
		const candiesToRemove = new Set(candies.move(0, 5, 0, []));

		for (const candy of candiesToRemove) {
			store.removeCandy(candy.id);
		}

		expect(countCandy()).to.equal(CANDY_LIMITS[CandyType.Default] - candiesToRemove.size());
		store.flush();

		const newCandies = store.getState(selectCandies);
		expect(countCandy()).to.equal(CANDY_LIMITS[CandyType.Default]);
		expect(newCandies.every((candy) => !candiesToRemove.has(candy))).to.equal(true);
	});

	it("should not create new candy when the amount increases", () => {
		const [template] = store.getState(selectCandies);

		for (const index of $range(1, 10)) {
			store.addCandy({ ...template, id: `__test__${index}` });
		}

		expect(countCandy()).to.equal(CANDY_LIMITS[CandyType.Default] + 10);
		store.flush();
		expect(countCandy()).to.equal(CANDY_LIMITS[CandyType.Default] + 10);
	});

	it("should create candy when a snake dies", () => {
		store.addSnake("__test__");
		store.snakeTick(0);
		store.flush();
		store.setSnakeIsDead("__test__");
		store.flush();
	});

	it("should keep candy population at the max if a snake dies", () => {
		const initialCandy = store.getState(selectCandies);

		store.addSnake("__test__");
		store.snakeTick(0);
		store.flush();
		store.setSnakeIsDead("__test__");
		store.flush();

		expect(countCandy() > CANDY_LIMITS[CandyType.Default]).to.equal(true);

		for (const index of $range(1, 50)) {
			const candy = initialCandy[index];
			store.removeCandy(candy.id);
		}

		store.flush();

		expect(countCandy() > CANDY_LIMITS[CandyType.Default]).to.equal(true);
	});

	it("should eat candy when a snake is close", () => {
		const candy = createCandy({ size: 10, position: new Vector2(1000, 1000) });
		store.addCandy(candy);
		store.addSnake("__test__", { head: new Vector2(1000, 1000.1) });
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

	it("should remove excess droppings", () => {
		const candies = fillArray(CANDY_LIMITS[CandyType.Dropping] + 1, () => {
			return createCandy({ type: CandyType.Dropping });
		});
		store.populateCandy(candies);
		expect(countCandy(CandyType.Dropping)).to.equal(CANDY_LIMITS[CandyType.Dropping] + 1);
		removeCandyIfAtLimit(CandyType.Dropping);
		removeCandyIfAtLimit(CandyType.Dropping);
		expect(countCandy(CandyType.Dropping)).to.equal(CANDY_LIMITS[CandyType.Dropping]);
	});
};
