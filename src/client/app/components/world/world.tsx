import { useSelector } from "@rbxts/react-reflex";
import Roact, { useMemo } from "@rbxts/roact";
import { selectSnakeIds } from "shared/store/snakes";
import { Snake } from "../snake";
import { useWorldView } from "./use-world-view";

export function World() {
	const ids = useSelector(selectSnakeIds);
	const { offset, scale } = useWorldView();

	const snakes = useMemo(() => {
		return ids.map((id) => <Snake key={`snake-${id}`} id={id} offset={offset} scale={scale} />);
	}, [ids, offset, scale]);

	return <>{snakes}</>;
}
