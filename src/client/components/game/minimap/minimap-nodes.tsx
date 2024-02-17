import { map, useInterval } from "@rbxts/pretty-react-hooks";
import React, { Element, useState } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { CanvasGroup } from "client/components/ui/canvas-group";
import { useDefined, useStore } from "client/hooks";
import { selectSnakeFromWorldSubject } from "client/store/world";
import { selectSnakesById, selectTopSnake } from "shared/store/snakes";

import { MinimapCursor } from "./minimap-cursor";
import { MinimapTracer } from "./minimap-tracer";
import { isValidPlayer, normalizeToWorldBounds, useFriendsInServer } from "./utils";

export function MinimapNodes() {
	const store = useStore();
	const snake = useDefined(useSelector(selectSnakeFromWorldSubject));
	const friends = useFriendsInServer();

	const [nodes, setNodes] = useState<Element[]>([]);

	const update = () => {
		const nodes: Element[] = [];

		// this doesn't need useSelector so we can avoid unneeded re-renders
		const snakes = store.getState(selectSnakesById);
		const topSnake = store.getState(selectTopSnake);

		for (const [, snake] of pairs(snakes)) {
			const size = snake.tracers.size();
			const step = math.floor(map(size, 0, 100, 2, 10));
			let previous = snake.head;

			const isPlayer = isValidPlayer(snake.id);
			const isFriend = friends.includes(snake.id);
			const isLeader = topSnake?.id === snake.id;

			for (const index of $range(0, size - 1, step)) {
				const tracer = snake.tracers[index];

				nodes.push(
					<MinimapTracer
						key={`${snake.id}-${index}`}
						from={normalizeToWorldBounds(previous)}
						to={normalizeToWorldBounds(tracer)}
						isPlayer={isPlayer}
						isFriend={isFriend}
						isLeader={isLeader}
					/>,
				);

				previous = tracer;
			}
		}

		setNodes(nodes);
	};

	useInterval(update, 2, { immediate: true });

	return (
		<>
			<CanvasGroup
				groupTransparency={0.5}
				backgroundTransparency={1}
				cornerRadius={new UDim(1, 0)}
				size={new UDim2(1, 0, 1, 0)}
			>
				{nodes}
			</CanvasGroup>

			{snake && <MinimapCursor point={normalizeToWorldBounds(snake.head)} angle={snake.angle} />}
		</>
	);
}
