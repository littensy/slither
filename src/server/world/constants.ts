import { WORLD_TICK } from "shared/constants";
import { CandyType } from "shared/store/candy";

// The world updates every world tick, which is less than the server's
// heartbeat rate. This means that we can schedule different cycles to run
// on different frames to reduce the load on a single frame.
export const SNAKE_TICK_PHASE = 0;
export const CANDY_TICK_PHASE = 0.33 * WORLD_TICK;
export const COLLISION_TICK_PHASE = 0.66 * WORLD_TICK;

export const CANDY_LIMITS: { readonly [K in CandyType]: number } = {
	[CandyType.Default]: 4096,
	[CandyType.Dropping]: 256,
	[CandyType.Loot]: 384,
};
