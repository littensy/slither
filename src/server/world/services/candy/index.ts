import { store } from "server/store";
import { CANDY_LIMITS, CANDY_TICK_PHASE, WORLD_TICK } from "shared/constants";
import { selectCandyCount } from "shared/store/candy";
import { identifySnake, selectAliveSnakesById } from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";
import { dropCandyOnDeath, dropCandyWhileBoosting, populateCandy } from "./candy-helpers";
import { onCandyTick } from "./candy-tick";

export * from "./candy-helpers";
export * from "./candy-tick";

export async function registerCandyService() {
	createScheduler({
		name: "candy",
		tick: WORLD_TICK,
		phase: CANDY_TICK_PHASE,
		onTick: onCandyTick,
	});

	// keep the amount of candy in the world at a constant size
	// if the amount of candy is less than the max, create more
	store.subscribe(
		selectCandyCount("default"),
		(count) => count < CANDY_LIMITS.default,
		(count) => populateCandy(CANDY_LIMITS.default - count),
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

	populateCandy(CANDY_LIMITS.default);
}
