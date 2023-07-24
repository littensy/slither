import { WORLD_TICK } from "shared/constants";
import { createScheduler } from "shared/utils/scheduler";
import { COLLISION_TICK_PHASE } from "../../constants";
import { onCollisionTick } from "./collision-tick";

export async function initCollisionService() {
	createScheduler({
		name: "collision",
		tick: WORLD_TICK,
		phase: COLLISION_TICK_PHASE,
		onTick: onCollisionTick,
	});
}
