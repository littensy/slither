import { Players, RunService } from "@rbxts/services";

// Premium benefit applied when earning money passively
// during a game or when purchasing a product from the shop.
export const PREMIUM_BENEFIT = 1.2;

export const WORLD_BOUNDS = 128;
export const WORLD_TICK = 1 / 20;

export const SNAKE_SPEED = 6;
export const SNAKE_BOOST_SPEED = 12;

export const REMOTE_TICK = 1 / 20; // Roblox limits

export const IS_PROD = game.PlaceId === 14162747150;
export const IS_CANARY = !IS_PROD;
export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

export const USER_ID = Players.LocalPlayer ? Players.LocalPlayer.UserId : 0;
export const USER_NAME = Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";
