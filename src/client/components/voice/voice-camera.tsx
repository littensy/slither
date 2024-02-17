import { useCamera, useEventListener, useInterval } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { selectSnakeFromWorldSubject } from "client/store/world";

import { toRealSpace } from "./utils";

export function VoiceCamera() {
	const camera = useCamera();
	const snake = useSelector(selectSnakeFromWorldSubject);

	const getCameraCFrame = (position: Vector2) => {
		const origin = toRealSpace(position).Position;
		return CFrame.lookAt(origin, origin.add(new Vector3(0, -1, 0)), new Vector3(0, 0, -1));
	};

	useEventListener(RunService.RenderStepped, () => {
		if (snake) {
			camera.CFrame = getCameraCFrame(snake.head);
		}
	});

	useInterval(() => {
		camera.CameraType = Enum.CameraType.Scriptable;
	}, 1);

	return <></>;
}
