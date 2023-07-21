import { Spring, useDebounceState, useMotor, usePrevious } from "@rbxts/pretty-react-hooks";
import Roact, { joinBindings, useEffect, useMemo, useRef } from "@rbxts/roact";
import { CanvasOrFrame } from "client/app/common/canvas-or-frame";
import { Frame } from "client/app/common/frame";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useRem } from "client/app/hooks";
import { palette } from "shared/data/palette";
import { getSnakeTracerSkin } from "shared/data/skins";

interface SnakeNameProps {
	readonly name: string;
	readonly head: Vector2;
	readonly headOffset: Vector2;
	readonly angle: number;
	readonly scale: number;
	readonly radius: number;
	readonly skin: string;
	readonly visible: boolean;
}

const TEXT_PADDING = 1;
const CANVAS_MARGIN = 2;
const TAIL_SIZE = 0.125;

/**
 * Specify the minimum brightness for a color.
 */
function minBrightness(color: Color3, min: number) {
	const [h, s, v] = Color3.toHSV(color);
	return Color3.fromHSV(h, s, math.max(v, min));
}

export function SnakeName({ name, head, headOffset, angle, scale, radius, skin, visible }: SnakeNameProps) {
	const rem = useRem();
	const previousHead = usePrevious(head) || head;
	const { tint } = getSnakeTracerSkin(skin, 0);

	const currentSide = useRef(1);
	const [side, setSide] = useDebounceState(1, { wait: 2 });
	const [sideTransition, setSideTransition] = useMotor(1);

	const [nameSize, setNameSize] = useMotor({ x: 0, y: 0 });
	const [nameHeight, setNameHeight] = useMotor(0);
	const [nameRotation, setNameRotation] = useMotor(0);
	const [nameTransparency, setNameTransparency] = useMotor(1);
	const [headPosition, setHeadPosition] = useMotor({ x: head.X * scale, y: head.Y * scale });

	const { size, position, tail } = useMemo(() => {
		const size = nameSize.map(({ x, y }) => {
			const width = x + rem((TEXT_PADDING + CANVAS_MARGIN) * 2);
			const height = y + rem((TEXT_PADDING + CANVAS_MARGIN) * 2);
			return new UDim2(0, width, 0, height);
		});

		const position = joinBindings({ nameHeight, headPosition }).map(({ nameHeight, headPosition }) => {
			return new UDim2(0, rem(headPosition.x), 0, rem(nameHeight + headPosition.y));
		});

		const tail = sideTransition.map((side) => {
			return new UDim2(0.5, 0, 1 - side, rem(TAIL_SIZE * math.sign(side - 0.5)));
		});

		return { size, position, tail };
	}, [rem]);

	// flip the side of the head this component is on when the snake
	// might overlap itself
	useEffect(() => {
		const angleConstrained = angle % (2 * math.pi);
		const nextSide = angleConstrained < math.rad(180) ? 1 : -1;

		if (visible && currentSide.current !== nextSide) {
			currentSide.current = nextSide;
			setSide(nextSide);
		}
	}, [angle, visible]);

	// without a separate effect, this may run regardless of whether
	// the debounce is still waiting
	useEffect(() => {
		setSideTransition(new Spring(math.max(side, 0), { frequency: 1 }));
	}, [side]);

	useEffect(() => {
		const height = scale * radius * 1.25 + (TEXT_PADDING + 2);

		setNameHeight(new Spring(height * side, { frequency: 1, dampingRatio: 0.5 }));

		setHeadPosition({
			x: new Spring(head.X * scale),
			y: new Spring(head.Y * scale),
		});
	}, [head, angle, radius, scale, side]);

	// rotate the name tag to simulate dragging behind the snake
	useEffect(() => {
		const rotation = math.clamp(30 * (head.X - previousHead.X), -45, 45);
		setNameRotation(new Spring(rotation * side, { frequency: 1, dampingRatio: 0.5 }));
	}, [head, previousHead, headOffset, side]);

	useEffect(() => {
		setNameTransparency(new Spring(visible ? 0 : 1, { frequency: 0.5 }));
	}, [visible]);

	return (
		<CanvasOrFrame
			groupTransparency={nameTransparency}
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={size}
			position={position}
			rotation={nameRotation}
			zIndex={0}
		>
			<uipadding
				PaddingTop={new UDim(0, rem(CANVAS_MARGIN))}
				PaddingBottom={new UDim(0, rem(CANVAS_MARGIN))}
				PaddingLeft={new UDim(0, rem(CANVAS_MARGIN))}
				PaddingRight={new UDim(0, rem(CANVAS_MARGIN))}
			/>

			<Shadow
				key="drop-shadow"
				shadowBlur={0.75}
				shadowColor={palette.crust}
				shadowOffset={rem(0.5)}
				shadowTransparency={0.5}
			/>

			<Frame
				key="tail"
				backgroundColor={palette.surface0}
				cornerRadius={new UDim(0, rem(2 * TAIL_SIZE))}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(1), 0, rem(1))}
				position={tail}
				rotation={45}
			/>

			<Frame
				key="background"
				backgroundColor={palette.surface0}
				cornerRadius={new UDim(0, rem(0.75))}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Text
				font="Inter"
				fontWeight={Enum.FontWeight.Medium}
				text={name}
				textSize={rem(1.5)}
				textColor={minBrightness(tint, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				change={{
					TextBounds: (rbx) => {
						setNameSize({
							x: new Spring(rbx.TextBounds.X),
							y: new Spring(rbx.TextBounds.Y),
						});
					},
				}}
			/>
		</CanvasOrFrame>
	);
}
