import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectSnakeIds } from "shared/store/snakes";
import { Snake } from "../snake";
import { useWorldView } from "./use-world-view";

export function World() {
	const ids = useSelector(selectSnakeIds);
	const { offset, scale } = useWorldView();

	return (
		<>
			{ids.map((id) => (
				<Snake key={`snake-${id}`} id={id} offset={offset} scale={scale} />
			))}
		</>
	);
}
