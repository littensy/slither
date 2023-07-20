import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { selectWorldCamera } from "client/store/world";
import { selectSnakeIds } from "shared/store/snakes";
import { Snake } from "./snake";

export function WorldSnakes() {
	const ids = useSelector(selectSnakeIds);
	const world = useSelector(selectWorldCamera);

	return (
		<Group zIndex={2}>
			{ids.map((id) => (
				<Snake key={`snake-${id}`} id={id} offset={world.offset} scale={world.scale} />
			))}
		</Group>
	);
}
