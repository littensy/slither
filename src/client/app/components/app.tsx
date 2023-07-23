import Roact from "@rbxts/roact";
import { Root } from "../common/root";
import { Controller } from "./controller";
import { Game } from "./game";
import { Menu } from "./menu";
import { Preloader } from "./preloader";
import { StatRail } from "./stat-rail";
import { World } from "./world";

export function App() {
	return (
		<>
			<Preloader />

			<Root>
				<Controller />
				<World />
				<Game />
			</Root>

			<Root>
				<Menu />
				<StatRail />
			</Root>
		</>
	);
}
