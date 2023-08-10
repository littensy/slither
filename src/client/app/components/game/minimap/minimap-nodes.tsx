import { map, useInterval } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { Element, useState } from "@rbxts/roact";
import { CanvasGroup } from "client/app/common/canvas-group";
import { useDefined, useStore } from "client/app/hooks";
import { selectSnakeFromWorldSubject } from "client/store/world";
import { LOCAL_USER } from "shared/constants";
import { selectSnakesById } from "shared/store/snakes";

import { MinimapCursor } from "./minimap-cursor";
import { MinimapTracer } from "./minimap-tracer";
import { normalizeToWorldBounds } from "./utils";

export function MinimapNodes() {
	const store = useStore();
	const snake = useDefined(useSelector(selectSnakeFromWorldSubject));
	const [nodes, setNodes] = useState<Element[]>([]);

	useInterval(
		() => {
			const nodes: Element[] = [];

			// this doesn't need useSelector so we can avoid unneeded re-renders
			const snakes = store.getState(selectSnakesById);

			for (const [, snake] of pairs(snakes)) {
				if (snake.id === LOCAL_USER) {
					continue;
				}

				const size = snake.tracers.size();
				const step = math.floor(map(size, 0, 100, 5, 20));
				let previous = snake.head;

				for (const index of $range(0, size - 1, step)) {
					const tracer = snake.tracers[index];
					nodes.push(
						<MinimapTracer
							key={`${snake.id}-${index}`}
							from={normalizeToWorldBounds(previous)}
							to={normalizeToWorldBounds(tracer)}
						/>,
					);
					previous = tracer;
				}
			}

			setNodes(nodes);
		},
		2,
		{ immediate: true },
	);

	return (
		<>
			<CanvasGroup
				key="nodes"
				groupTransparency={0.8}
				backgroundTransparency={1}
				cornerRadius={new UDim(1, 0)}
				size={new UDim2(1, 0, 1, 0)}
			>
				{nodes}
			</CanvasGroup>

			{snake && (
				<MinimapCursor
					key="map-cursor"
					point={normalizeToWorldBounds(snake.head)}
					rotation={math.deg(snake.angle)}
				/>
			)}
		</>
	);
}
