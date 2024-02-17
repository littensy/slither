import React from "@rbxts/react";

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
			<Music />
			<Preloader />
			<Voice />

			<Layer>
				<Controller />
				<World />
				<Game />
			</Layer>

			<Layer>
				<Menu />
				<Stats />
			</Layer>

			<Layer>
				<Alerts />
			</Layer>
		</ErrorHandler>
	);
}
