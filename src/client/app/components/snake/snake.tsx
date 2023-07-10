import { useViewport } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { getSegmentRadius, selectSnakeById } from "shared/store/snakes";
import { SnakeHead } from "./snake-head";
import { SnakeSegment } from "./snake-segment";

interface SnakeProps {
	readonly id: string;
	readonly offset: Vector2;
	readonly scale: number;
}

export function Snake({ id, offset, scale }: SnakeProps) {
	const rem = useRem();
	const viewport = useViewport();
	const snake = useSelector(selectSnakeById(id));

	if (!snake) {
		return <></>;
	}

	const size = getSegmentRadius(snake.score) * 2;

	const isOnScreen = (segment: Vector2) => {
		const screen = viewport.getValue();
		const position = segment.mul(rem * scale).add(offset.mul(rem * scale));

		return position.X >= 0 && position.X <= screen.X && position.Y >= 0 && position.Y <= screen.Y;
	};

	return (
		<Group position={new UDim2(0, offset.X * rem * scale, 0, offset.Y * rem * scale)}>
			<SnakeHead
				key="head"
				size={size * scale}
				position={snake.head.mul(scale)}
				angle={snake.angle}
				targetAngle={snake.targetAngle}
			/>

			{snake.segments.mapFiltered((segment, index) => {
				if (!isOnScreen(segment)) {
					return;
				}

				const previous = snake.segments[index - 1] || snake.head;
				const direction = previous !== segment ? previous.sub(segment).Unit : Vector2.zero;
				const angle = math.atan2(direction.Y, direction.X);

				return (
					<SnakeSegment
						key={`segment-${index}`}
						size={size * scale}
						position={segment.mul(scale)}
						angle={angle}
						index={index}
					/>
				);
			})}
		</Group>
	);
}
