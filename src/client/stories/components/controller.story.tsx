import "client/app/react-config";

import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import { Controller } from "client/components/controller";
import { Frame } from "client/components/ui/frame";
import { Group } from "client/components/ui/group";
import { Text } from "client/components/ui/text";
import { World } from "client/components/world/world";
import { useRem } from "client/hooks";
import { RootProvider } from "client/providers/root-provider";
import { store } from "client/store";
import { selectWorldCamera } from "client/store/world";
import { USER_NAME, WORLD_TICK } from "shared/constants/core";
import { palette } from "shared/constants/palette";
import { getRandomBaseSnakeSkin } from "shared/constants/skins";
import { describeSnakeFromScore, selectLocalSnake } from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";

import { useMockRemotes } from "../utils/use-mock-remotes";

const START_SIZE = 0;
const SIZE_INCREMENT = 100;
const DEBUG_SIZES = [0, 500, 1000, 2500, 5000, 10000, 20000, 40000, 80000, 160000];

function Debugger() {
	const rem = useRem();
	const snake = useSelector(selectLocalSnake);
	const world = useSelector(selectWorldCamera);

	if (!snake) {
		return <></>;
	}

	const description = describeSnakeFromScore(snake.score);

	return (
		<>
			<Text
				text={`Score: ${snake.score}`}
				textColor={palette.text}
				textXAlignment="Left"
				textYAlignment="Bottom"
				position={new UDim2(0, rem(2), 1, rem(-2))}
			/>

			<Text
				text={`Tracers: ${math.floor(description.length)}`}
				textColor={palette.text}
				textXAlignment="Left"
				textYAlignment="Bottom"
				position={new UDim2(0, rem(2), 1, rem(-4))}
			/>

			<Group size={new UDim2(1, 0, 0.5, 0)}>
				<uilistlayout
					FillDirection="Horizontal"
					VerticalAlignment="Center"
					HorizontalAlignment="Center"
					SortOrder="LayoutOrder"
				/>

				{DEBUG_SIZES.map((score, index) => {
					const description = describeSnakeFromScore(score);
					const diameter = rem(world.scale * description.radius * 2);

					return (
						<Frame
							key={`debug-${index}`}
							size={new UDim2(0, diameter, 0, diameter)}
							backgroundColor={palette.red}
							cornerRadius={new UDim(1, 0)}
							layoutOrder={index}
						>
							<Text
								text={`${score}\nl${math.floor(description.length)}\nd${string.format(
									"%.2f",
									description.radius,
								)}`}
								textColor={palette.crust}
								textScaled
								size={new UDim2(1, 0, 1, 0)}
							>
								<uipadding PaddingBottom={new UDim(0, rem(0.5))} PaddingTop={new UDim(0, rem(0.5))} />
								<uitextsizeconstraint MaxTextSize={rem(2)} />
							</Text>
						</Frame>
					);
				})}
			</Group>
		</>
	);
}

export = hoarcekat(() => {
	useMockRemotes();

	useEffect(() => {
		store.addSnake(USER_NAME, {
			name: Players.LocalPlayer.DisplayName,
			skin: getRandomBaseSnakeSkin().id,
			score: START_SIZE,
		});

		return createScheduler({
			name: "world-tick",
			tick: WORLD_TICK,
			onTick: store.snakeTick,
		});
	}, []);

	useInterval(() => {
		store.incrementSnakeScore(USER_NAME, SIZE_INCREMENT);
	}, 0.5);

	return (
		<RootProvider>
			<World />
			<Controller />
			<Debugger />
		</RootProvider>
	);
});
