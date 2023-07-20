import { WORLD_TICK } from "shared/constants";
import { createScheduler } from "shared/utils/scheduler";
import { connectBotWorker } from "./workers/bot-worker";
import { connectCandyWorker, onCandyTick } from "./workers/candy-worker";
import { onCollisionTick } from "./workers/collision-worker";
import { connectSnakeWorker, onSnakeTick } from "./workers/snake-worker";

/**
 * The world updates every 1/12th of a second, and the work can be delegated
 * across several frames. Note that because the collision cycle can be very
 * costly, no work is done for a while to allow the framerate to recover.
 */
const cycles = [
	{ name: "snake", onTick: onSnakeTick },
	{ name: "candy", phase: 0.25 * WORLD_TICK, onTick: onCandyTick },
	{ name: "collision", phase: 0.5 * WORLD_TICK, onTick: onCollisionTick },
];

const workers = [connectBotWorker, connectSnakeWorker, connectCandyWorker];

function start() {
	for (const { name, phase, onTick } of cycles) {
		createScheduler({ name, interval: WORLD_TICK, phase, onTick });
	}

	for (const worker of workers) {
		worker();
	}
}

task.defer(start);
