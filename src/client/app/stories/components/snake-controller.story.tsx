import { hoarcekat, useInterval } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Frame } from "client/app/common/frame";
import { Text } from "client/app/common/text";
import { SnakeController } from "client/app/components/snake-controller";
import { World } from "client/app/components/world/world";
import { useRem } from "client/app/hooks";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { selectWorldCamera } from "client/store/world";
import { LOCAL_USER, WORLD_TICK } from "shared/constants";
import { palette } from "shared/data/palette";
import { getRandomDefaultSnakeSkin } from "shared/data/skins";
import { describeSnakeFromScore, selectLocalSnake } from "shared/store/snakes";
import { createScheduler } from "shared/utils/scheduler";
import { useMockRemotes } from "../utils/use-mock-remotes";

const defaultSnakeDescription = describeSnakeFromScore(0);

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
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				size={
					new UDim2(
						0,
						rem(world.scale * defaultSnakeDescription.radius * 2),
						0,
						rem(world.scale * defaultSnakeDescription.radius * 2),
					)
				}
				position={new UDim2(0.5, 0, 0.5, rem(-8))}
				backgroundColor={palette.red}
				cornerRadius={new UDim(1, 0)}
			/>
		</>
	);
}

export = hoarcekat(() => {
	useMockRemotes();

	useEffect(() => {
		store.addSnake(LOCAL_USER, {
			name: Players.LocalPlayer.DisplayName,
			skin: getRandomDefaultSnakeSkin().id,
			score: 0,
		});

		return createScheduler({
			name: "world-tick",
			interval: WORLD_TICK,
			onTick: store.snakeTick,
		});
	}, []);

	useInterval(() => {
		store.incrementSnakeScore(LOCAL_USER, 1);
	}, 1 / 60);

	return (
		<RootProvider>
			<World />
			<SnakeController />
			<Debugger />
		</RootProvider>
	);
});
