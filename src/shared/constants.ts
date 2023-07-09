import { RunService } from "@rbxts/services";

export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();
export const IS_CLIENT = RunService.IsClient();
export const IS_SERVER = RunService.IsServer();
