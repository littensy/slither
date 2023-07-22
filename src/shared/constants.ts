import { Players, RunService } from "@rbxts/services";
import { CandyType } from "./store/candy";

export const WORLD_BOUNDS = 196;
export const WORLD_TICK = 1 / 15;

// Remotes can fire up to 20 times per second
export const REMOTE_TICK = 1 / 20;

export const CANDY_LIMITS: { readonly [K in CandyType]: number } = {
	default: 4096,
	dropping: 256,
	loot: 384,
};

export const SNAKE_SPEED = 5;
export const SNAKE_BOOST_SPEED = 10;

export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
export const LOCAL_USER = Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";
