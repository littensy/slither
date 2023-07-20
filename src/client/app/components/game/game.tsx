import { Spring, lerpBinding, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { CanvasOrFrame } from "client/app/common/canvas-or-frame";
import { selectHasLocalSnake } from "shared/store/snakes";
import { Minimap } from "./minimap";

export function Game() {
	const inGame = useSelector(selectHasLocalSnake);
	const [transition, setTransition] = useMotor(0);

	useEffect(() => {
		setTransition(new Spring(inGame ? 1 : 0, { frequency: 2 }));
	}, [inGame]);

	return (
		<CanvasOrFrame
			groupTransparency={lerpBinding(transition, 1, 0)}
			backgroundTransparency={1}
			size={new UDim2(1, 0, 1, 0)}
		>
			<Minimap />
		</CanvasOrFrame>
	);
}
