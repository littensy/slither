import { useInterval } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { Element, useState } from "@rbxts/roact";
import { CanvasGroup } from "client/app/common/canvas-group";
import { useRem, useStore } from "client/app/hooks";
import { LOCAL_USER } from "shared/constants";
import { selectLocalSnake, selectSnakesById } from "shared/store/snakes";
import { MinimapNode } from "./minimap-node";

export function MinimapNodes() {
	const store = useStore();
	const rem = useRem();
	const snake = useSelector(selectLocalSnake);
	const [nodes, setNodes] = useState<Element[]>([]);

	useInterval(() => {
		const nodes: Element[] = [];
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
	}, 5);

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

			{snake && <MinimapNode key="client-node" point={snake.head} isClient />}
		</>
	);
}
