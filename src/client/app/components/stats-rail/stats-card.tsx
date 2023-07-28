import { Spring, useMotor } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { CanvasOrFrame } from "client/app/common/canvas-or-frame";
import { Frame } from "client/app/common/frame";
import { Group } from "client/app/common/group";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useRem } from "client/app/hooks";
import { palette } from "shared/data/palette";

interface StatsCardProps {
	readonly emoji: string;
	readonly label: string;
	readonly value: string;
	readonly primary: Color3;
	readonly secondary: Color3;
	readonly enabled: boolean;
	readonly order: number;
}

const CARD_MARGIN = 1;
const CARD_PADDING = 0.75;
const CARD_HEIGHT = 4;
const CARD_EMOJI_WIDTH = 2;
const CARD_CANVAS_MARGIN = 3;

export function StatsCard({ emoji, label, value, primary, secondary, enabled, order }: StatsCardProps) {
	const primaryDark = primary.Lerp(palette.crust, 0.75);
	const secondaryDark = secondary.Lerp(palette.crust, 0.75);

	const rem = useRem();
	const [transparency, setTransparency] = useMotor(1);
	const [textWidth, setTextWidth] = useMotor({ label: 0, value: 0 });

	const size = useMemo(() => {
		return textWidth.map(({ label, value }) => {
			const content = math.max(label, value);
			const width = CARD_EMOJI_WIDTH + CARD_PADDING + 2 * CARD_MARGIN;
			return new UDim2(0, rem(width) + content, 0, rem(CARD_HEIGHT));
		});
	}, [rem]);

	useEffect(() => {
		setTransparency(new Spring(enabled ? 0 : 0.5, { frequency: 1 }));
	}, [enabled]);

	return (
		<ReactiveButton backgroundTransparency={1} size={size} layoutOrder={order}>
			<CanvasOrFrame
				key="fade-out"
				groupTransparency={transparency}
				backgroundTransparency={1}
				size={new UDim2(1, rem(2 * CARD_CANVAS_MARGIN), 1, rem(2 * CARD_CANVAS_MARGIN))}
				position={new UDim2(0, rem(-CARD_CANVAS_MARGIN), 0, rem(-CARD_CANVAS_MARGIN))}
			>
				<uipadding
					key="canvas-margin"
					PaddingTop={new UDim(0, rem(CARD_CANVAS_MARGIN))}
					PaddingBottom={new UDim(0, rem(CARD_CANVAS_MARGIN))}
					PaddingLeft={new UDim(0, rem(CARD_CANVAS_MARGIN))}
					PaddingRight={new UDim(0, rem(CARD_CANVAS_MARGIN))}
				/>

				<Shadow
					key="drop-shadow"
					shadowColor={primary.Lerp(secondary, 0.5)}
					shadowBlur={0.3}
					shadowPosition={rem(0.5)}
					shadowSize={rem(4)}
					shadowTransparency={0.7}
				/>

				<Frame
					key="background"
					backgroundTransparency={0.3}
					backgroundColor={palette.white1}
					cornerRadius={new UDim(0, rem(0.5))}
					size={new UDim2(1, 0, 1, 0)}
				>
					<uigradient key="gradient" Color={new ColorSequence(primaryDark, secondaryDark)} />
				</Frame>

				<Group key="indicator-container" clipsDescendants size={new UDim2(0, rem(0.35), 1, 0)}>
					<Frame
						key="indicator"
						backgroundColor={primary}
						cornerRadius={new UDim(0, rem(0.5))}
						size={new UDim2(0, rem(1), 1, 0)}
					/>
				</Group>

				<Text
					key="emoji"
					text={emoji}
					textSize={rem(2)}
					size={new UDim2(0, rem(CARD_EMOJI_WIDTH), 1, 0)}
					position={new UDim2(0, rem(CARD_MARGIN), 0, 0)}
				/>

				<Text
					key="label"
					font="Inter"
					fontWeight={Enum.FontWeight.SemiBold}
					text={label}
					textColor={primary}
					textTransparency={0.05}
					textSize={rem(1)}
					textXAlignment="Left"
					textYAlignment="Bottom"
					position={new UDim2(0, rem(CARD_MARGIN + CARD_EMOJI_WIDTH + CARD_PADDING), 0.5, -rem(0.25))}
					change={{
						TextBounds: (rbx) => {
							setTextWidth({ label: new Spring(rbx.TextBounds.X) });
						},
					}}
				/>

				<Text
					key="value"
					font="Rubik"
					text={value}
					textColor={palette.white1}
					textTransparency={0.05}
					textSize={rem(1.5)}
					textXAlignment="Left"
					textYAlignment="Top"
					position={new UDim2(0, rem(CARD_MARGIN + CARD_EMOJI_WIDTH + CARD_PADDING), 0.5, -rem(0.25))}
					change={{
						TextBounds: (rbx) => {
							setTextWidth({ value: new Spring(rbx.TextBounds.X) });
						},
					}}
				/>
			</CanvasOrFrame>
		</ReactiveButton>
	);
}
