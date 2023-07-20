import { store } from "server/store";
import { getSafePointInWorld } from "server/world";
import { candyGrid, createCandy, onCandyTick } from "server/world/workers/candy-worker";
import { onCollisionTick } from "server/world/workers/collision-worker";
import { onSnakeTick } from "server/world/workers/snake-worker";
import { CANDY_LIMITS, WORLD_BOUNDS } from "shared/constants";
import { benchmark } from "shared/utils/benchmark";
import { fillArray } from "shared/utils/object-utils";

store.destroy();
store.resetState();
candyGrid.clear();

for (const index of $range(0, 50)) {
	const x = (index * 4) % WORLD_BOUNDS;
	const y = math.floor(index / 4) * 4;
	const position = new Vector2(x, y);

	store.addSnake(`Snake ${index}`, {
		head: position,
		score: 1000 + 160 * index,
		desiredAngle: 0.5 * index,
	});
}

store.populateCandy(fillArray(CANDY_LIMITS.default, () => createCandy()));

export = benchmark({
	functions: {
		onSnakeTick,
		onCandyTick,
		onCollisionTick,
		getSafePointInWorld,
	},
});
