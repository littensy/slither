import Roact from "@rbxts/roact";
import { Root } from "./common/root";
import { Controller } from "./components/controller";
import { Game } from "./components/game";
import { Menu } from "./components/menu";
import { Preloader } from "./components/preloader";
import { StatsRail } from "./components/stats-rail";
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
				<StatsRail />
			</Root>
		</>
	);
}
