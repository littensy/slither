import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { selectWorldCamera } from "client/store/world";
import { Snake } from "./snake";
import { useSnakesOnScreen } from "./use-snakes-on-screen";

export function Snakes() {
	const rem = useRem();
	const world = useSelector(selectWorldCamera);
	const snakesOnScreen = useSnakesOnScreen(world.scale, world.offset);

	const [offset, setOffset] = useMotor({
		x: world.offset.X * world.scale,
		y: world.offset.Y * world.scale,
	});

	const position = useMemo(() => {
		return offset.map(({ x, y }) => {
			return new UDim2(0.5, rem(x), 0.5, rem(y));
		});
	}, [rem]);

	useEffect(() => {
		setOffset({
			x: new Spring(world.offset.X * world.scale),
			y: new Spring(world.offset.Y * world.scale),
		});
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
