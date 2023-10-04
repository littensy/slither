import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { CanvasOrFrame } from "client/common/canvas-or-frame";
import { useMotion } from "client/hooks";
import { selectWorldSubject } from "client/store/world";

import { Compass } from "./compass";
import { Minimap } from "./minimap";

export function Game() {
	const inGame = useSelector(selectWorldSubject) !== undefined;
	const [transition, transitionMotion] = useMotion(0);

	useEffect(() => {
		transitionMotion.spring(inGame ? 1 : 0);
	}, [inGame]);

	return (
		<CanvasOrFrame
			groupTransparency={lerpBinding(transition, 1, 0)}
			backgroundTransparency={1}
			size={new UDim2(1, 0, 1, 0)}
		>
			<Minimap key="minimap" />
			<Compass key="compass" />
		</CanvasOrFrame>
	);
}
