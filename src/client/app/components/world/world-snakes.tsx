import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { selectWorldCamera } from "client/store/world";
import { selectSnakes } from "shared/store/snakes";
import { Snake } from "./snake";

export function WorldSnakes() {
	const snakes = useSelector(selectSnakes);
	const world = useSelector(selectWorldCamera);

	return (
		<Group zIndex={2}>
			{snakes.map((snake) => (
				<Snake key={`snake-${snake.id}`} snake={snake} offset={world.offset} scale={world.scale} />
			))}
		</Group>
	);
}
