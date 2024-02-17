import "client/app/react-config";

import { hoarcekat } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Menu } from "client/components/menu";
import { InputCapture } from "client/components/ui/input-capture";
import { World } from "client/components/world";
import { RootProvider } from "client/providers/root-provider";
import { store } from "client/store";
import { USER_NAME } from "shared/constants/core";
import { selectSnakeById } from "shared/store/snakes";

import { useMockRemotes } from "../utils/use-mock-remotes";

export = hoarcekat(() => {
	useMockRemotes();

	const toggle = () => {
		const snake = store.getState(selectSnakeById(USER_NAME));

		if (snake) {
			store.removeSnake(USER_NAME);
		} else {
			store.addSnake(USER_NAME);
		}
	};

	return (
		<RootProvider>
			<InputCapture
				onInputBegan={(rbx, input) => {
					if (input.KeyCode === Enum.KeyCode.F) {
						toggle();
					}
				}}
			/>
			<World />
			<Menu />
		</RootProvider>
	);
});
