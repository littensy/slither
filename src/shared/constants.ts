import { Players, RunService } from "@rbxts/services";

export const WORLD_BOUNDS = 256;
export const WORLD_MAX_CANDY = 4096;
export const WORLD_TICK = 1 / 12;

export const SNAKE_SPEED = 4;
export const SNAKE_BOOST_SPEED = 10;

export const IS_CLIENT = RunService.IsClient();
export const IS_SERVER = RunService.IsServer();
export const IS_STUDIO = RunService.IsStudio();
export const IS_EDIT = IS_STUDIO && !RunService.IsRunning();
export const LOCAL_USER = IS_CLIENT && Players.LocalPlayer ? Players.LocalPlayer.Name : "(server)";
