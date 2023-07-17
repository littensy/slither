import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectWorldCamera } from "client/store/world";
import { selectSnakeIds } from "shared/store/snakes";
import { Backdrop } from "./backdrop";
import { Candy } from "./candy";
import { Snake } from "./snake";
import { WorldFocus } from "./world-focus";

export function World() {
	const ids = useSelector(selectSnakeIds);
	const world = useSelector(selectWorldCamera);

	return (
		<>
			<Backdrop />
			<Candy />
			<WorldFocus />
			{ids.map((id) => (
				<Snake key={`snake-${id}`} id={id} offset={world.offset} scale={world.scale} />
			))}
		</>
	);
}
