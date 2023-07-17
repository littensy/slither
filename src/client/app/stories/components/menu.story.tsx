import { hoarcekat } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { InputCapture } from "client/app/common/input-capture";
import { Menu } from "client/app/components/menu";
import { World } from "client/app/components/world";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { LOCAL_USER } from "shared/constants";
import { selectSnakeById } from "shared/store/snakes";
import { useMockRemotes } from "../utils/use-mock-remotes";

export = hoarcekat(() => {
	useMockRemotes();

	const toggle = () => {
		const snake = store.getState(selectSnakeById(LOCAL_USER));

		if (snake) {
			store.removeSnake(LOCAL_USER);
		} else {
			store.addSnake(LOCAL_USER, "", Vector2.zero, "");
		}
	};

	return (
		<RootProvider>
			<InputCapture
				onInputBegan={(rbx, input) => {
					if (input.KeyCode === Enum.KeyCode.F) toggle();
				}}
			/>
			<World />
			<Menu />
		</RootProvider>
	);
});
