import { Spring, useCamera, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { LOCAL_USER } from "shared/constants";
import { getSnakeSkin } from "shared/data/skins";
import { describeSnakeFromScore, selectSnakeById, selectSnakeIsBoosting } from "shared/store/snakes";
import { SNAKE_ON_SCREEN_MARGIN } from "./constants";
import { SnakeHead } from "./snake-head";
import { SnakeName } from "./snake-name";
import { SnakeTracer } from "./snake-tracer";

interface SnakeProps {
	readonly id: string;
	readonly offset: Vector2;
	readonly scale: number;
}

export function Snake({ id, offset, scale }: SnakeProps) {
	const rem = useRem();
	const camera = useCamera();

	const snake = useSelectorCreator(selectSnakeById, id);
	const boosting = useSelectorCreator(selectSnakeIsBoosting, id);

	const [smoothOffset, setSmoothOffset] = useMotor({
		x: offset.X * scale,
		y: offset.Y * scale,
	});

	useEffect(() => {
		setSmoothOffset({
			x: new Spring(offset.X * scale),
			y: new Spring(offset.Y * scale),
		});
	}, [offset, scale]);

	if (!snake) {
		return <></>;
	}

	const skin = getSnakeSkin(snake.skin);
	const { radius } = describeSnakeFromScore(snake.score);

	const isOnScreen = (tracer: Vector2) => {
		const margin = rem(new Vector2(SNAKE_ON_SCREEN_MARGIN, SNAKE_ON_SCREEN_MARGIN));
		const screen = camera.ViewportSize.add(margin.mul(2));

		const positionNotCentered = rem(tracer.mul(scale).add(offset.mul(scale)));
		const position = positionNotCentered.add(screen.mul(0.5));

		return position.X >= 0 && position.X <= screen.X && position.Y >= 0 && position.Y <= screen.Y;
	};

	return (
		<Group position={smoothOffset.map((offset) => new UDim2(0.5, rem(offset.x), 0.5, rem(offset.y)))}>
			<SnakeHead
				key="head"
				scale={scale}
				size={radius * 2}
				position={snake.head}
				angle={snake.angle}
				targetAngle={snake.desiredAngle}
				skin={skin}
				boost={boosting}
				dead={snake.dead}
			/>

			{id !== LOCAL_USER + "=" && (
				<SnakeName
					key="nametag"
					name={snake.name}
					head={snake.head}
					headOffset={offset}
					angle={snake.angle}
					radius={radius}
					scale={scale}
					skin={skin.id}
				/>
			)}

			{snake.tracers.mapFiltered((tracer, index) => {
				const previous = snake.tracers[index - 1] || snake.head;
				const middle = tracer.add(previous).div(2);

				if (!isOnScreen(middle)) {
					return;
				}

				return (
					<SnakeTracer
						key={`tracer-${index}`}
						scale={scale}
						size={radius * 2}
						from={tracer}
						to={previous}
						index={index}
						skin={skin}
						boost={boosting}
						dead={snake.dead}
					/>
				);
			})}
		</Group>
	);
}
