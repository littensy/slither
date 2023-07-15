import { WORLD_STEP_TIME } from "shared/constants";
import { createScheduler } from "shared/utils/scheduler";
import { connectCandyWorker, onCandyStep } from "./workers/candy-worker";
import { onCollisionStep } from "./workers/collision-worker";
import { connectPhysicsWorker, onPhysicsStep } from "./workers/physics-worker";

/**
 * The world updates every 1/16th of a second, and the work can be delegated
 * across up to four frames. Note that because the collision phase can be very
 * costly, no work is done for another frame to allow the framerate to recover.
 */
const phases = [
	{ onStep: onPhysicsStep },
	{ phase: 0.25 * WORLD_STEP_TIME, onStep: onCandyStep },
	{ phase: 0.5 * WORLD_STEP_TIME, onStep: onCollisionStep },
];

for (const { phase, onStep } of phases) {
	createScheduler({ interval: WORLD_STEP_TIME, phase, onStep });
}

connectPhysicsWorker();
connectCandyWorker();
