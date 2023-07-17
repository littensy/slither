import { WORLD_TICK } from "shared/constants";
import { createScheduler } from "shared/utils/scheduler";
import { connectBotWorker } from "./workers/bot-worker";
import { connectCandyWorker, onCandyTick } from "./workers/candy-worker";
import { onCollisionTick } from "./workers/collision-worker";
import { connectPhysicsWorker, onPhysicsTick } from "./workers/physics-worker";

/**
 * The world updates every 1/15th of a second, and the work can be delegated
 * across up to four frames. Note that because the collision phase can be very
 * costly, no work is done for another frame to allow the framerate to recover.
 */
const phases = [
	{ onTick: onPhysicsTick },
	{ phase: 0.25 * WORLD_TICK, onTick: onCandyTick },
	{ phase: 0.5 * WORLD_TICK, onTick: onCollisionTick },
];

function start() {
	for (const { phase, onTick } of phases) {
		createScheduler({ interval: WORLD_TICK, phase, onTick });
	}

	connectBotWorker();
	connectPhysicsWorker();
	connectCandyWorker();
}

task.defer(start);
