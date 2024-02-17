import { useEffect } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";

export function useToggleTouchControls(visible: boolean) {
	useEffect(() => {
		// todo: use a non-deprecated method
		UserInputService.ModalEnabled = !visible;
	}, [visible]);
}
