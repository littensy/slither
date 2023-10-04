import Roact from "@rbxts/roact";

import { Alerts } from "../components/alerts";
import { Controller } from "../components/controller";
import { ErrorHandler } from "../components/error-handler";
import { Game } from "../components/game";
import { Menu } from "../components/menu";
import { Music } from "../components/music";
import { Preloader } from "../components/preloader";
import { Stats } from "../components/stats";
import { Layer } from "../components/ui/layer";
import { Voice } from "../components/voice";
import { World } from "../components/world";

export function App() {
	return (
		<ErrorHandler>
			<Music key="music" />
			<Preloader key="preloader" />
			<Voice key="voice" />

			<Layer key="world-layer">
				<Controller key="controller" />
				<World key="world" />
				<Game key="game" />
			</Layer>

			<Layer key="menu-layer">
				<Menu key="menu" />
				<Stats key="stats" />
			</Layer>

			<Layer key="modal-layer">
				<Alerts key="alerts" />
			</Layer>
		</ErrorHandler>
	);
}
