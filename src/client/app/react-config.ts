import { backend } from "@rbxts/react-devtools-core";
import ReactGlobals from "@rbxts/react-globals";
import { RunService } from "@rbxts/services";

if (RunService.IsStudio()) {
	ReactGlobals.__DEV__ = true;
	ReactGlobals.__PROFILE__ = true;

	backend.connectToDevtools();
}
