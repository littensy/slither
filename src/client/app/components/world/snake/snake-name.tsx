import { Spring, useDebounceState, useMotor, usePrevious } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo, useRef } from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { Group } from "client/app/common/group";
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
}

const TEXT_PADDING = 1;

export function SnakeName({ name, head, headOffset, angle, scale, radius, skin }: SnakeNameProps) {
	const rem = useRem();
	const previousHead = usePrevious(head) || head;
	const previousHeadOffset = usePrevious(headOffset) || headOffset;
	const { tint } = getSnakeTracerSkin(skin, 0);

	const currentSide = useRef(1);
	const [side, setSide] = useDebounceState(1, { wait: 2 });
	const [sideTransition, setSideTransition] = useMotor(0);

	const [nameSize, setNameSize] = useMotor({ x: 0, y: 0 });
	const [namePosition, setNamePosition] = useMotor({ x: 0, y: 0 });
	const [nameRotation, setNameRotation] = useMotor(0);
	const [headPosition, setHeadPosition] = useMotor({ x: head.X * scale, y: head.Y * scale });

	const { size, position, offset, tail } = useMemo(() => {
		const size = nameSize.map(({ x, y }) => {
			const width = x + rem(TEXT_PADDING * 2);
			const height = y + rem(TEXT_PADDING * 2);
			return new UDim2(0, width, 0, height);
		});

		const position = namePosition.map(({ x, y }) => {
			return new UDim2(0, rem(x), 0, rem(y));
		});

		const offset = headPosition.map(({ x, y }) => {
			return new UDim2(0, rem(x), 0, rem(y));
		});

		const tail = sideTransition.map((side) => {
			return new UDim2(0.5, 0, 1 - side, rem(0.125 * math.sign(side - 0.5)));
		});

		return { size, position, offset, tail };
	}, [rem]);

	useEffect(() => {
		const angleConstrained = angle % (2 * math.pi);
		const nextSide = angleConstrained < math.rad(180) ? 1 : -1;

		if (currentSide.current !== nextSide) {
			currentSide.current = nextSide;
			setSide(nextSide);
		}
	}, [angle]);

	useEffect(() => {
		setSideTransition(new Spring(math.max(side, 0), { frequency: 1 }));
	}, [side]);

	useEffect(() => {
		const y = scale * radius * 1.25 + (TEXT_PADDING + 2);
		const rotation = math.clamp(20 * (head.X - previousHead.X + (headOffset.X - previousHeadOffset.X)), -45, 45);

		setNamePosition({
			x: new Spring(0, { frequency: 1, dampingRatio: 0.5 }),
			y: new Spring(y * side, { frequency: 1, dampingRatio: 0.5 }),
		});

		setNameRotation(new Spring(rotation * side, { frequency: 1, dampingRatio: 0.5 }));

		setHeadPosition({
			x: new Spring(head.X * scale),
			y: new Spring(head.Y * scale),
		});
	}, [head, angle, radius, scale]);

	return (
		<Group anchorPoint={new Vector2(0.5, 0.5)} size={size} position={offset} zIndex={0}>
			<Group key="nametag" position={position} rotation={nameRotation}>
				<Shadow
					key="drop-shadow"
					shadowBlur={0.75}
					shadowColor={tint.Lerp(palette.crust, 0.5)}
					shadowOffset={rem(0.5)}
					shadowTransparency={0}
				/>

				<Frame
					key="tail"
					backgroundColor={tint}
					cornerRadius={new UDim(0, rem(0.25))}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={new UDim2(0, rem(1), 0, rem(1))}
					position={tail}
					rotation={45}
				/>

				<Frame
					key="background"
					backgroundColor={tint}
					cornerRadius={new UDim(0, rem(0.75))}
					size={new UDim2(1, 0, 1, 0)}
				/>

				<Text
					font="Inter"
					fontWeight={Enum.FontWeight.Medium}
					text={name}
					textSize={rem(1.5)}
					textColor={palette.crust}
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
			</Group>
		</Group>
	);
}
