import React, { useEffect, useMemo } from "@rbxts/react";
import { Frame } from "client/components/ui/frame";
import { Group } from "client/components/ui/group";
import { ReactiveButton } from "client/components/ui/reactive-button";
import { Shadow } from "client/components/ui/shadow";
import { Text } from "client/components/ui/text";
import { fonts } from "client/constants/fonts";
import { springs } from "client/constants/springs";
import { useMotion, useRem } from "client/hooks";
import { palette } from "shared/constants/palette";

import { Transition } from "../ui/transition";

interface StatsCardProps {
	readonly onClick?: () => void;
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

export function StatsCard({ onClick, emoji, label, value, primary, secondary, enabled, order }: StatsCardProps) {
	const primaryDark = primary.Lerp(palette.crust, 0.75);
	const secondaryDark = secondary.Lerp(palette.crust, 0.75);

	const rem = useRem();
	const [transparency, transparencyMotion] = useMotion(1);
	const [textWidth, textWidthMotion] = useMotion({ label: 0, value: 0 });

	const size = useMemo(() => {
		return textWidth.map(({ label, value }) => {
			const content = math.max(label, value);
			const width = CARD_EMOJI_WIDTH + CARD_PADDING + 2 * CARD_MARGIN;
			return new UDim2(0, rem(width) + content, 0, rem(CARD_HEIGHT));
		});
	}, [rem]);

	useEffect(() => {
		transparencyMotion.spring(enabled ? 0 : 0.75, springs.slow);
	}, [enabled]);

	return (
		<ReactiveButton onClick={onClick} soundVariant="alt" backgroundTransparency={1} size={size} layoutOrder={order}>
			<Transition
				groupTransparency={transparency}
				size={new UDim2(1, rem(2 * CARD_CANVAS_MARGIN), 1, rem(2 * CARD_CANVAS_MARGIN))}
				position={new UDim2(0, rem(-CARD_CANVAS_MARGIN), 0, rem(-CARD_CANVAS_MARGIN))}
			>
				<uipadding
					PaddingTop={new UDim(0, rem(CARD_CANVAS_MARGIN))}
					PaddingBottom={new UDim(0, rem(CARD_CANVAS_MARGIN))}
					PaddingLeft={new UDim(0, rem(CARD_CANVAS_MARGIN))}
					PaddingRight={new UDim(0, rem(CARD_CANVAS_MARGIN))}
				/>

				<Shadow
					shadowColor={primary.Lerp(secondary, 0.5)}
					shadowBlur={0.3}
					shadowPosition={rem(0.5)}
					shadowSize={rem(4)}
					shadowTransparency={0.7}
				/>

				<Frame
					backgroundTransparency={0.3}
					backgroundColor={palette.white}
					cornerRadius={new UDim(0, rem(0.5))}
					size={new UDim2(1, 0, 1, 0)}
				>
					<uigradient Color={new ColorSequence(primaryDark, secondaryDark)} />
				</Frame>

				<Group clipsDescendants size={new UDim2(0, rem(0.35), 1, 0)}>
					<Frame
						backgroundColor={primary}
						cornerRadius={new UDim(0, rem(0.5))}
						size={new UDim2(0, rem(1), 1, 0)}
					/>
				</Group>

				<Text
					text={emoji}
					textSize={rem(2)}
					size={new UDim2(0, rem(CARD_EMOJI_WIDTH), 1, 0)}
					position={new UDim2(0, rem(CARD_MARGIN), 0, 0)}
				/>

				<Text
					font={fonts.inter.bold}
					text={label}
					textColor={primary}
					textTransparency={0.05}
					textSize={rem(1)}
					textXAlignment="Left"
					textYAlignment="Bottom"
					position={new UDim2(0, rem(CARD_MARGIN + CARD_EMOJI_WIDTH + CARD_PADDING), 0.5, -rem(0.25))}
					change={{
						TextBounds: (rbx) => {
							textWidthMotion.spring({ label: rbx.TextBounds.X });
						},
					}}
				/>

				<Text
					font={fonts.inter.regular}
					text={value}
					textColor={palette.white}
					textTransparency={0.05}
					textSize={rem(1.5)}
					textXAlignment="Left"
					textYAlignment="Top"
					position={new UDim2(0, rem(CARD_MARGIN + CARD_EMOJI_WIDTH + CARD_PADDING), 0.5, -rem(0.25))}
					change={{
						TextBounds: (rbx) => {
							textWidthMotion.spring({ value: rbx.TextBounds.X });
						},
					}}
				/>
			</Transition>
		</ReactiveButton>
	);
}
