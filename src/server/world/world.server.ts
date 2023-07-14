import { WORLD_STEP_TIME } from "shared/constants";
import { createScheduler } from "shared/utils/scheduler";
import { connectCandyWorker, handleCandyUpdate } from "./workers/candy-worker";
import { connectCollisionWorker, handleCollisionUpdate } from "./workers/collision-worker";
import { connectPhysicsWorker, handlePhyicsUpdate } from "./workers/physics-worker";

// We can use the createScheduler to run different tasks in different
// phases of the world step. This helps to offload work between multiple
// frames and keep the world step time consistent.
const PHYSICS_PHASE = 0;
const COLLISION_PHASE = 0.33 * WORLD_STEP_TIME;
const CANDY_PHASE = 0.66 * WORLD_STEP_TIME;

const phases = [
	{ phase: PHYSICS_PHASE, onStep: handlePhyicsUpdate },
	{ phase: COLLISION_PHASE, onStep: handleCollisionUpdate },
	{ phase: CANDY_PHASE, onStep: handleCandyUpdate },
];

for (const { phase, onStep } of phases) {
	createScheduler({ interval: WORLD_STEP_TIME, phase, onStep });
}

connectPhysicsWorker();
connectCollisionWorker();
connectCandyWorker();
