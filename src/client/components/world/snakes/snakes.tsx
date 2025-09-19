import { composeBindings, toBinding } from "@rbxts/pretty-react-hooks";
import React, { useCallback, useMemo, useRef, useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { Group } from "client/components/ui/group";
import { springs } from "client/constants/springs";
import { useRem, useSpring } from "client/hooks";
import { selectWorldCamera } from "client/store/world";

import { Snake } from "./snake";
import { SnakeBindings } from "./use-snake-bindings";
import { useSnakesOnScreen } from "./use-snakes-on-screen";

export function Snakes() {
	const rem = useRem();
	const world = useSelector(selectWorldCamera);
	const snakesOnScreen = useSnakesOnScreen(world.scale, world.offset);
	const previousOffset = useRef(new UDim2(0.5, 0, 0.5, 0));

	const [transition, transitionSpring] = useSpring(1);
	const [snakeBindings, setSnakeBindings] = useState<SnakeBindings>();

	const offset = useMemo((): React.Binding<UDim2> => {
		if (!snakeBindings) {
			return toBinding(new UDim2(0.5, 0, 0.5, 0));
		}

		return composeBindings(snakeBindings.head.line, transition, ({ toX, toY }, alpha) => {
			const offset = new UDim2(0.5, rem(-toX), 0.5, rem(-toY));
			return alpha !== 1 ? previousOffset.current.Lerp(offset, alpha) : offset;
		});
	}, [rem, snakeBindings]);

	const onSubjectChanged = useCallback(
		(bindings: SnakeBindings) => {
			// Manually transition from the current subject to the next
			if (snakeBindings && snakeBindings !== bindings) {
				previousOffset.current = offset.getValue();
				transitionSpring.setGoal(1, {
					...springs.world,
					position: 0,
					precision: 1e-8,
				});
			}

			setSnakeBindings(bindings);
		},
		[offset],
	);

	return (
		<Group position={offset} zIndex={2}>
			{snakesOnScreen.map((snakeOnScreen) => {
				return (
					<Snake
						key={snakeOnScreen.snake.id}
						snakeOnScreen={snakeOnScreen}
						scale={world.scale}
						offset={world.offset}
						subject={world.subject}
						setSnakeBindings={onSubjectChanged}
					/>
				);
			})}
		</Group>
	);
}
