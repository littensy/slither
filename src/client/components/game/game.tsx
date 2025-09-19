import { lerpBinding } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { useSpring } from "client/hooks";
import { selectWorldSubject } from "client/store/world";

import { Transition } from "../ui/transition";
import { Compass } from "./compass";
import { Minimap } from "./minimap";

export function Game() {
	const inGame = useSelector(selectWorldSubject) !== undefined;
	const [transition, transitionSpring] = useSpring(0);

	useEffect(() => {
		transitionSpring.setGoal(inGame ? 1 : 0);
	}, [inGame]);

	return (
		<Transition groupTransparency={lerpBinding(transition, 1, 0)} size={new UDim2(1, 0, 1, 0)}>
			<Minimap />
			<Compass />
		</Transition>
	);
}
