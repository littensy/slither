import "client/dev";

import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { InputCapture } from "client/common/input-capture";
import { Menu } from "client/components/menu";
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
				key="shortcuts"
				onInputBegan={(rbx, input) => {
					if (input.KeyCode === Enum.KeyCode.F) {
						toggle();
					}
				}}
			/>
			<World key="world" />
			<Menu key="menu" />
		</RootProvider>
	);
});
