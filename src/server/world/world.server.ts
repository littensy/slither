import { afterTests } from "server/test/helpers/after-tests";
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
const CYCLES = [
	{ name: "snake", phase: 0, onTick: onSnakeTick },
	{ name: "candy", phase: 0.33 * WORLD_TICK, onTick: onCandyTick },
	{ name: "collision", phase: 0.66 * WORLD_TICK, onTick: onCollisionTick },
] as const;

const WORKERS = [connectBotWorker, connectSnakeWorker, connectCandyWorker] as const;

afterTests(() => {
	for (const { name, phase, onTick } of CYCLES) {
		createScheduler({ name, interval: WORLD_TICK, phase, onTick });
	}

	for (const worker of WORKERS) {
		worker();
	}
});
