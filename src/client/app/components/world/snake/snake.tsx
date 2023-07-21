import { Spring, useCamera, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { selectWorldSubject } from "client/store/world";
import { getSnakeSkin } from "shared/data/skins";
import { SnakeEntity, describeSnakeFromScore, selectSnakeIsBoosting } from "shared/store/snakes";
import { SNAKE_ON_SCREEN_MARGIN } from "./constants";
import { SnakeHead } from "./snake-head";
import { SnakeName } from "./snake-name";
import { SnakeTracer } from "./snake-tracer";

interface SnakeProps {
	readonly snake: SnakeEntity;
	readonly offset: Vector2;
	readonly scale: number;
}

export function Snake({ snake, offset, scale }: SnakeProps) {
	const rem = useRem();
	const camera = useCamera();

	const subject = useSelector(selectWorldSubject);
	const boosting = useSelectorCreator(selectSnakeIsBoosting, snake.id);

	const skin = getSnakeSkin(snake.skin);
	const radius = describeSnakeFromScore(snake.score).radius;
	const distance = snake.head.sub(offset.mul(-1)).Magnitude;
	const showNameTag = snake.id !== subject && !snake.dead && distance < 16;

	const [smoothOffset, setSmoothOffset] = useMotor({
		x: offset.X * scale,
		y: offset.Y * scale,
	});

	const isOnScreen = (tracer: Vector2) => {
		const margin = rem(new Vector2(SNAKE_ON_SCREEN_MARGIN, SNAKE_ON_SCREEN_MARGIN));
		const screen = camera.ViewportSize.add(margin.mul(2));

		const positionNotCentered = rem(tracer.mul(scale).add(offset.mul(scale)));
		const position = positionNotCentered.add(screen.mul(0.5));

		return position.X >= 0 && position.X <= screen.X && position.Y >= 0 && position.Y <= screen.Y;
	};

	useEffect(() => {
		setSmoothOffset({
			x: new Spring(offset.X * scale),
			y: new Spring(offset.Y * scale),
		});
	}, [offset, scale]);

	const children = useMemo(() => {
		return snake.tracers.mapFiltered((tracer, index) => {
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
		});
	}, [snake.tracers, scale, radius, skin, boosting, snake.dead]);

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

			<SnakeName
				key="name-tag"
				name={snake.name}
				head={snake.head}
				headOffset={offset}
				angle={snake.angle}
				radius={radius}
				scale={scale}
				skin={skin.id}
				visible={showNameTag}
			/>

			{children}
		</Group>
	);
}
