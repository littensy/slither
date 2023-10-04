import { Players, RunService } from "@rbxts/services";
import { $NODE_ENV } from "rbxts-transform-env";

// Premium benefit applied when earning money passively
// during a game or when purchasing a product from the shop.
export const PREMIUM_BENEFIT = 1.2;

export const WORLD_BOUNDS = 128;
export const WORLD_TICK = 1 / 20;

export const SNAKE_SPEED = 6;
export const SNAKE_BOOST_SPEED = 12;

export const REMOTE_TICK = 1 / 20; // Roblox limits

export const IS_PROD = $NODE_ENV === "production";
export const IS_CANARY = $NODE_ENV === "canary";
export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

export const USER_ID = Players.LocalPlayer ? Players.LocalPlayer.UserId : 0;
export const USER_NAME = Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";
