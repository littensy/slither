import { store } from "server/store";
import { CANDY_LIMITS, CANDY_TICK_PHASE } from "server/world/constants";
import { WORLD_TICK } from "shared/constants/core";
import { CandyType, selectCandyCount } from "shared/store/candy";
import { identifySnake, selectAliveSnakesById } from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";

import { dropCandyOnDeath, dropCandyWhileBoosting, populateCandy, removeCandyIfAtLimit } from "./candy-helpers";
import { onCandyTick } from "./candy-tick";

export async function initCandyService() {
	createScheduler({
		name: "candy",
		tick: WORLD_TICK,
		phase: CANDY_TICK_PHASE,
		onTick: onCandyTick,
	});

	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	store.subscribe(
		selectCandyCount(CandyType.Default),
		(count) => count < CANDY_LIMITS[CandyType.Default],
		(count) => populateCandy(CANDY_LIMITS[CandyType.Default] - count),
	);

	// delete excess loot candy if it is over the limit
	store.subscribe(
		selectCandyCount(CandyType.Loot),
		(count) => count > CANDY_LIMITS[CandyType.Loot],
		() => removeCandyIfAtLimit(CandyType.Loot),
	);

	// delete excess boost candy if it is over the limit
	store.subscribe(
		selectCandyCount(CandyType.Dropping),
		(count) => count > CANDY_LIMITS[CandyType.Dropping],
		() => removeCandyIfAtLimit(CandyType.Dropping),
	);

	store.observe(selectAliveSnakesById, identifySnake, ({ id }) => {
		// while boosting, decrement the snake's score and create candy
		// on the snake's tail
		const disconnect = dropCandyWhileBoosting(id);

		// when the snake dies, create candy on the snake's tracers
		return () => {
			disconnect();
			dropCandyOnDeath(id);
		};
	});

	populateCandy(CANDY_LIMITS[CandyType.Default]);
}
