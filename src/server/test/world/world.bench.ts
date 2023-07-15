import { store } from "server/store";
import { createCandy, handleCandyUpdate } from "server/world/workers/candy-worker";
import { handleCollisionUpdate } from "server/world/workers/collision-worker";
import { handlePhysicsUpdate } from "server/world/workers/physics-worker";
import { benchmark } from "shared/utils/benchmark";

store.destroy();
store.resetState();

for (const index of $range(0, 50)) {
	const position = new Vector2(10 * index, 0);
	store.addSnake(`Snake ${index}`, "", position, "");
	store.patchSnake(`Snake ${index}`, {
		score: 160 * index,
		targetAngle: 0.5 * index,
	});
	store.addCandy(createCandy());
}

export = benchmark({
	functions: {
		handleCollisionUpdate,
		handlePhysicsUpdate,
		handleCandyUpdate,
	},
});
