import { Players, RunService } from "@rbxts/services";

// Premium benefit applied when earning money passively
// during a game or when purchasing a product from the shop.
export const PASSIVE_PREMIUM_BENEFIT = 1.1;
export const PRODUCT_PREMIUM_BENEFIT = 1.2;

export const WORLD_BOUNDS = 196;
export const WORLD_TICK = 1 / 20;

export const SNAKE_SPEED = 5;
export const SNAKE_BOOST_SPEED = 10;

export const REMOTE_TICK = 1 / 20; // Roblox limits

export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

export const LOCAL_USER = Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";
