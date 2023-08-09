import { useSelector } from "@rbxts/react-reflex";
import { spring } from "@rbxts/ripple";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useMotion, useRem } from "client/app/hooks";
import { springs } from "client/app/utils/springs";
import { selectWorldCamera } from "client/store/world";
import { Snake } from "./snake";
import { useSnakesOnScreen } from "./use-snakes-on-screen";

export function Snakes() {
	const rem = useRem();
	const world = useSelector(selectWorldCamera);
	const snakesOnScreen = useSnakesOnScreen(world.scale, world.offset);
	const [offset, offsetMotion] = useMotion(world.offset.mul(world.scale));

	const position = useMemo(() => {
		return offset.map(({ X, Y }) => {
			return new UDim2(0.5, rem(X), 0.5, rem(Y));
		});
	}, [rem]);

	useEffect(() => {
		offsetMotion.spring(world.offset.mul(world.scale), springs.world);
	}, [world.offset, world.scale]);

	return (
		<Group position={position} zIndex={2}>
			{snakesOnScreen.map((snakeOnScreen) => {
				return (
					<Snake
						key={snakeOnScreen.snake.id}
						snakeOnScreen={snakeOnScreen}
						scale={world.scale}
						offset={world.offset}
						offsetSmooth={offset}
						subject={world.subject}
					/>
				);
			})}
		</Group>
	);
}
