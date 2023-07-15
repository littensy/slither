import { store } from "server/store";
import { getSafePointInWorld } from "server/world/utils";
import { createCandy, onCandyStep } from "server/world/workers/candy-worker";
import { onCollisionStep } from "server/world/workers/collision-worker";
import { onPhysicsStep } from "server/world/workers/physics-worker";
import { WORLD_BOUNDS } from "shared/constants";
import { benchmark } from "shared/utils/benchmark";

store.destroy();
store.resetState();

for (const index of $range(0, 50)) {
	const x = (index * 4) % WORLD_BOUNDS;
	const y = math.floor(index / 4) * 4;
	const position = new Vector2(x, y);
	store.addSnake(`Snake ${index}`, "", position, "");
	store.patchSnake(`Snake ${index}`, {
		score: 1000 + 160 * index,
		targetAngle: 0.5 * index,
	});
	store.addCandy(createCandy());
}

export = benchmark({
	functions: {
		onPhysicsStep,
		onCandyStep,
		onCollisionStep,
		getSafePointInWorld,
	},
});
