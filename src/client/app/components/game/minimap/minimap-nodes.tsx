import { useInterval } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { Element, useState } from "@rbxts/roact";
import { CanvasGroup } from "client/app/common/canvas-group";
import { useDefined, useStore } from "client/app/hooks";
import { LOCAL_USER } from "shared/constants";
import { selectLocalSnake, selectSnakesById } from "shared/store/snakes";
import { MinimapNode } from "./minimap-node";

export function MinimapNodes() {
	const store = useStore();
	const snake = useDefined(useSelector(selectLocalSnake));
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

				nodes.push(<MinimapNode key={snake.id} point={snake.head} />);

				for (const index of $range(0, snake.tracers.size() - 1, 5)) {
					const tracer = snake.tracers[index];
					nodes.push(<MinimapNode key={`${snake.id}-${index}`} point={tracer} />);
				}
			}

			setNodes(nodes);
		},
		1,
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

			{snake && <MinimapNode key="client-node" point={snake.head} rotation={math.deg(snake.angle)} isClient />}
		</>
	);
}
