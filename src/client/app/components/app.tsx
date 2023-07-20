import Roact from "@rbxts/roact";
import { Root } from "../common/root";
import { Game } from "./game";
import { Menu } from "./menu";
import { Preloader } from "./preloader";
import { SnakeController } from "./snake-controller";
import { World } from "./world";

export function App() {
	return (
		<>
			<Preloader />

			<Root>
				<SnakeController />
				<World />
				<Game />
			</Root>

			<Root>
				<Menu />
			</Root>
		</>
	);
}
