import { Players, RunService } from "@rbxts/services";

export const IS_CLIENT = RunService.IsClient();
export const IS_SERVER = RunService.IsServer();
export const IS_STUDIO = RunService.IsStudio();
export const IS_EDIT = IS_STUDIO && !RunService.IsRunning();
export const LOCAL_ID = IS_CLIENT ? Players.LocalPlayer.Name : "(server)";
