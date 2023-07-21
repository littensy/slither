import { ReplicatedStorage, RunService } from "@rbxts/services";
import { Reporters, TestBootstrap } from "@rbxts/testez";

if (RunService.IsStudio()) {
	TestBootstrap.run(
		[script.Parent!, ReplicatedStorage.WaitForChild("TS").WaitForChild("test")],
		Reporters.TextReporter,
	);
}
