import "client/app/react-config";

import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { Controller } from "client/components/controller";
import { World } from "client/components/world/world";
import { RootProvider } from "client/providers/root-provider";
import { store } from "client/store";
import { USER_NAME, WORLD_TICK } from "shared/constants/core";
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
				head: new Vector2(math.random(-10, 10), math.random(-10, 10)),
				skin: getRandomBaseSnakeSkin().id,
				score: math.random(0, 8000),
			});
		}

		store.populateCandy(
			fillArray(50, (index) => ({
				id: `${index}`,
				position: new Vector2(math.random(-50, 50), math.random(-25, 25)),
				size: math.random(1, 50),
				color: getRandomAccent(),
				type: CandyType.Default,
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
			<Controller />
		</RootProvider>
	);
});
