import { useDebounceState, usePrevious } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useMemo, useRef } from "@rbxts/react";
import { Frame } from "client/components/ui/frame";
import { Shadow } from "client/components/ui/shadow";
import { Text } from "client/components/ui/text";
import { Transition } from "client/components/ui/transition";
import { fonts } from "client/constants/fonts";
import { springs } from "client/constants/springs";
import { useRem, useSpring } from "client/hooks";
import { palette } from "shared/constants/palette";
import { getSnakeSkinForTracer } from "shared/constants/skins";

interface SnakeNameTagProps {
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

export function SnakeNameTag({ name, head, headOffset, angle, scale, radius, skin, visible }: SnakeNameTagProps) {
	const rem = useRem();
	const previousHead = usePrevious(head) || head;
	const { tint } = getSnakeSkinForTracer(skin, 0);

	const currentSide = useRef(1);
	const [side, setSide] = useDebounceState(1, { wait: 2 });
	const [sideTransition, sideTransitionSpring] = useSpring(1);

	const [nameSize, nameSizeSpring] = useSpring(Vector2.one);
	const [nameHeight, nameHeightSpring] = useSpring(0);
	const [nameRotation, nameRotationSpring] = useSpring(0);
	const [nameTransparency, nameTransparencySpring] = useSpring(1);

	const { size, position, tail } = useMemo(() => {
		const size = nameSize.map(({ X, Y }) => {
			const width = X + rem((TEXT_PADDING + CANVAS_MARGIN) * 2);
			const height = Y + rem((TEXT_PADDING + CANVAS_MARGIN) * 2);
			return new UDim2(0, width, 0, height);
		});

		const position = nameHeight.map((height) => {
			return new UDim2(0.5, 0, 0.5, rem(height));
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
		sideTransitionSpring.setGoal(math.max(side, 0));
	}, [side]);

	useEffect(() => {
		const height = scale * radius * 1.25 + (TEXT_PADDING + 2);
		nameHeightSpring.setGoal(height * side, { tension: 150, friction: 18 });
	}, [angle, radius, scale, side]);

	// rotate the name tag to simulate dragging behind the snake
	useEffect(() => {
		const rotation = math.clamp(30 * (head.X - previousHead.X), -45, 45);
		nameRotationSpring.setGoal(rotation * side, { tension: 150, friction: 18 });
	}, [head, previousHead, headOffset, side]);

	useEffect(() => {
		nameTransparencySpring.setGoal(visible ? 0 : 1, springs.slow);
	}, [visible]);

	return (
		<Transition
			groupTransparency={nameTransparency}
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

			<Shadow shadowBlur={0.75} shadowColor={palette.crust} shadowPosition={rem(0.5)} shadowTransparency={0.5} />

			<Frame
				backgroundColor={palette.surface0}
				cornerRadius={new UDim(0, rem(2 * TAIL_SIZE))}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(1), 0, rem(1))}
				position={tail}
				rotation={45}
			/>

			<Frame
				backgroundColor={palette.surface0}
				cornerRadius={new UDim(0, rem(0.75))}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Text
				font={fonts.inter.medium}
				text={name}
				textSize={rem(1.5)}
				textColor={minBrightness(tint, 0.5)}
				size={new UDim2(1, 0, 1, 0)}
				change={{
					TextBounds: (rbx) => {
						nameSizeSpring.setGoal(rbx.TextBounds, springs.responsive);
					},
				}}
			/>
		</Transition>
	);
}
