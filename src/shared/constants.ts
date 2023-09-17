import { Players, RunService } from "@rbxts/services";

import { CandyType } from "./store/candy";

export const WORLD_BOUNDS = 196;
export const WORLD_TICK = 1 / 20;

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

export const SNAKE_SPEED = 5;
export const SNAKE_BOOST_SPEED = 10;

export const REMOTE_TICK = 1 / 20; // Roblox limits

export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

export const LOCAL_USER = Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";
