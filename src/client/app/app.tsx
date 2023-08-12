import Roact from "@rbxts/roact";

import { Root } from "./common/root";
import { Alerts } from "./components/alerts";
import { Controller } from "./components/controller";
import { Game } from "./components/game";
import { Menu } from "./components/menu";
import { Preloader } from "./components/preloader";
import { Stats } from "./components/stats";
import { World } from "./components/world";

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
				<Stats />
			</Root>

			<Root>
				<Alerts />
			</Root>
		</>
	);
}
