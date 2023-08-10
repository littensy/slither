import { COLLISION_TICK_PHASE, WORLD_TICK } from "shared/constants";
import { createScheduler } from "shared/utils/scheduler";

import { onCollisionTick } from "./collision-tick";

createScheduler({
	name: "collision",
	tick: WORLD_TICK,
	phase: COLLISION_TICK_PHASE,
	onTick: onCollisionTick,
});
