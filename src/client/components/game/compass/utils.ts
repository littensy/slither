import { useSelector } from "@rbxts/react-reflex";
import { useEffect, useState } from "@rbxts/roact";
import { setTimeout } from "@rbxts/set-timeout";
import { selectTopSnake } from "shared/store/snakes";

/**
 * Returns the current leader's state. If the ID changed, this value
 * will be debounced to prevent jitter and excess updates.
 */
export function useLeader() {
	const currentLeader = useSelector(selectTopSnake);
	const [leader, setLeader] = useState(currentLeader);

	useEffect(() => {
		if (currentLeader?.id === leader?.id) {
			setLeader(currentLeader);
		}
	}, [currentLeader]);

	useEffect(() => {
		if (currentLeader?.id !== leader?.id) {
			return setTimeout(() => setLeader(currentLeader), 0.5);
		}
	}, [currentLeader?.id]);

	return leader;
}
