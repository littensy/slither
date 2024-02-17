import "client/app/react-config";

import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { Controller } from "client/components/controller";
import { Game } from "client/components/game";
import { World } from "client/components/world";
import { RootProvider } from "client/providers/root-provider";
import { store } from "client/store";
import { USER_NAME, WORLD_BOUNDS, WORLD_TICK } from "shared/constants/core";
import { getRandomAccent } from "shared/constants/palette";
import { getRandomBaseSnakeSkin } from "shared/constants/skins";
import { CandyType } from "shared/store/candy";
import { fillArray } from "shared/utils/object-utils";
import { createScheduler } from "shared/utils/scheduler";

import { useMockRemotes } from "../utils/use-mock-remotes";

const IDS = [USER_NAME, ...fillArray(10, (index) => `${index}`)];

export = hoarcekat(() => {
	useMockRemotes();

	useEffect(() => {
		for (const id of IDS) {
			store.addSnake(id, {
				name: id,
				head:
					id === USER_NAME
						? Vector2.zero
						: new Vector2(
								math.random(-WORLD_BOUNDS, WORLD_BOUNDS),
								math.random(-WORLD_BOUNDS, WORLD_BOUNDS),
							),
				skin: getRandomBaseSnakeSkin().id,
				score: math.random(0, 5000),
			});
		}

		store.populateCandy(
			fillArray(512, (index) => ({
				id: `test-${index}`,
				type: CandyType.Default,
				position: new Vector2(
					(math.random() * 2 - 1) * WORLD_BOUNDS * 0.2,
					(math.random() * 2 - 1) * WORLD_BOUNDS * 0.2,
				),
				size: math.random(1, 10),
				color: getRandomAccent(),
			})),
		);

		return createScheduler({
			name: "world-tick",
			tick: WORLD_TICK,
			onTick: store.snakeTick,
		});
	}, []);

	useInterval(() => {
		for (const id of IDS) {
			if (id !== USER_NAME) {
				store.turnSnake(id, math.random() * 2 * math.pi);
			}
		}
	}, 1.5);

	return (
		<RootProvider>
			<World />
			<Game />
			<Controller />
		</RootProvider>
	);
});
