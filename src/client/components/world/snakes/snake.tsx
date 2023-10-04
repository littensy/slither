import { useSelector } from "@rbxts/react-reflex";
import Roact, { memo, useEffect, useMemo } from "@rbxts/roact";
import { selectSkinOverride } from "client/store/menu";
import { USER_NAME } from "shared/constants/core";
import { describeSnakeFromScore } from "shared/store/snakes";

import { SnakeHead } from "./snake-head";
import { SnakeNameTag } from "./snake-name-tag";
import { SnakeTracer } from "./snake-tracer";
import { SnakeBindings, useSnakeBindings } from "./use-snake-bindings";
import { SnakeOnScreen } from "./use-snakes-on-screen";

interface SnakeProps {
	readonly snakeOnScreen: SnakeOnScreen;
	readonly scale: number;
	readonly offset: Vector2;
	readonly subject?: string;
	readonly setSnakeBindings: (bindings: SnakeBindings) => void;
}

export const Snake = memo<SnakeProps>(({ snakeOnScreen, scale, offset, subject, setSnakeBindings }) => {
	const snake = snakeOnScreen.snake;
	const snakeBindings = useSnakeBindings(snakeOnScreen, scale, snake.id === subject);
	const snakeSkinOverride = useSelector(selectSkinOverride);

	const radius = describeSnakeFromScore(snake.score).radius;
	const distance = snake.head.sub(offset.mul(-1)).Magnitude;
	const skin = snake.id !== subject ? snake.skin : snakeSkinOverride ?? snake.skin;
	const showNameTag = snake.id !== subject && !snake.dead && distance < 16;

	const children = useMemo(() => {
		return snakeOnScreen.tracers.mapFiltered((tracer) => {
			const index = tracer.index;
			const bindings = snakeBindings.bindings.get(index);

			if (!bindings) {
				return;
			}

			return (
				<SnakeTracer
					key={`tracer-${index}`}
					line={bindings.line}
					effects={bindings.effects}
					index={index}
					skinId={skin}
				/>
			);
		});
	}, [snakeOnScreen]);

	useEffect(() => {
		if (snake.id === subject) {
			setSnakeBindings(snakeBindings);
		}
	}, [snakeBindings, subject]);

	return (
		<>
			{snakeOnScreen.head && (
				<SnakeHead
					key="head"
					angle={snake.angle}
					desiredAngle={snake.desiredAngle}
					line={snakeBindings.head.line}
					effects={snakeBindings.head.effects}
					skinId={skin}
					isClient={snake.id === USER_NAME}
				>
					<SnakeNameTag
						key="name-tag"
						name={snake.name}
						head={snake.head}
						headOffset={offset}
						angle={snake.angle}
						radius={radius}
						scale={scale}
						skin={skin}
						visible={showNameTag}
					/>
				</SnakeHead>
			)}
			{children}
		</>
	);
});
