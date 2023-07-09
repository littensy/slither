import { ReplicatedStorage } from "@rbxts/services";
import { Reporters, TestBootstrap } from "@rbxts/testez";
import { IS_STUDIO } from "shared/constants";

if (IS_STUDIO) {
	TestBootstrap.run(
		[script.Parent!, ReplicatedStorage.WaitForChild("TS").WaitForChild("test")],
		Reporters.TextReporter,
	);
}
