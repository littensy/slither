import { hoarcekat, useInterval, useMountEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Text } from "client/app/common/text";
import { Snake } from "client/app/components/snake/snake";
import { useRem } from "client/app/hooks";
import { RootProvider } from "client/app/providers/root-provider";
import { store } from "client/store";
import { SNAKE_STEP_TIME, selectSnakeById } from "shared/store/snakes";

function ScoreCounter() {
	const rem = useRem();
	const { score } = useSelector(selectSnakeById("id")) || {};

	return (
		<Text
			text={`${score}`}
			textColor={Color3.fromRGB(255, 255, 255)}
			textSize={2 * rem}
			textXAlignment="Right"
			textYAlignment="Bottom"
			position={new UDim2(1, -rem, 1, -rem)}
		/>
	);
}

export = hoarcekat(() => {
	useMountEffect(() => {
		store.addSnake("id", "name", Vector2.zero);
		store.incrementSnakeScore("id", 100);
	});

	useInterval(() => {
		store.updateSnakes(SNAKE_STEP_TIME);
		store.incrementSnakeScore("id", 1);
	}, SNAKE_STEP_TIME);

	useInterval(() => {
		store.setSnakeTargetAngle("id", math.random() * 2 * math.pi);
	}, 1.5);

	return (
		<RootProvider>
			<Snake id="id" offset={new Vector2(3, 3)} scale={6} />
			<ScoreCounter />
		</RootProvider>
	);
});
