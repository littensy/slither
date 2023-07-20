import { WORLD_TICK } from "shared/constants";
import { createScheduler } from "shared/utils/scheduler";
import { connectBotWorker } from "./workers/bot-worker";
import { connectCandyWorker, onCandyTick } from "./workers/candy-worker";
import { onCollisionTick } from "./workers/collision-worker";
import { connectSnakeWorker, onSnakeTick } from "./workers/snake-worker";

/**
 * The world updates every world tick, which is less than the server's
 * heartbeat rate. This means that we can schedule different cycles to run
 * on different frames to reduce the load on a single frame.
 */
const cycles = [
	{ name: "snake", onTick: onSnakeTick },
	{ name: "candy", phase: 0.33 * WORLD_TICK, onTick: onCandyTick },
	{ name: "collision", phase: 0.66 * WORLD_TICK, onTick: onCollisionTick },
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
