import Roact from "@rbxts/roact";

import { Root } from "./common/root";
import { Alerts } from "./components/alerts";
import { Controller } from "./components/controller";
import { ErrorHandler } from "./components/error-handler";
import { Game } from "./components/game";
import { Menu } from "./components/menu";
import { Music } from "./components/music";
import { Preloader } from "./components/preloader";
import { Stats } from "./components/stats";
import { Voice } from "./components/voice";
import { World } from "./components/world";

export function App() {
	return (
		<ErrorHandler>
			<Music />
			<Preloader />
			<Voice />

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
		</ErrorHandler>
	);
}
