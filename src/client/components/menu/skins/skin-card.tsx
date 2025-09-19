import { blend } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { Image } from "client/components/ui/image";
import { ReactiveButton } from "client/components/ui/reactive-button";
import { Shadow } from "client/components/ui/shadow";
import { useRem, useSpring } from "client/hooks";
import { images, playSound, sounds } from "shared/assets";

import { SkinIndicator } from "./skin-indicator";
import { SkinThumbnail } from "./skin-thumbnail";
import { DIRECTIONS_TO_HIDE, usePalette } from "./utils";

interface SkinCardProps {
	readonly id: string;
	readonly index: number;
	readonly active: boolean;
	readonly shuffle?: readonly string[];
	readonly onClick: () => void;
}

const SIZE = 12;
const SIZE_INACTIVE = 9.5;
const PADDING = 1.5;

function getPosition(rem: number, index: number) {
	const offset = math.sign(index) * (SIZE - SIZE_INACTIVE) * 0.5;
	const position = index * (SIZE + PADDING);

	return new UDim2(0.5, (position + offset) * rem, 1, 0);
}

function getSize(rem: number, active: boolean) {
	const sizeActive = new UDim2(0, SIZE * rem, 0, SIZE * rem);
	const sizeInactive = new UDim2(0, SIZE_INACTIVE * rem, 0, SIZE_INACTIVE * rem);

	return active ? sizeActive : sizeInactive;
}

export function SkinCard({ id, index, active, shuffle, onClick }: SkinCardProps) {
	const hidden = DIRECTIONS_TO_HIDE.includes(index);

	const rem = useRem();
	const palette = usePalette(id, shuffle);
	const [position, positionSpring] = useSpring(getPosition(rem(1), math.sign(index) * 3));
	const [size, sizeSpring] = useSpring(getSize(rem(1), false));
	const [transparency, transparencySpring] = useSpring(1);

	useEffect(() => {
		positionSpring.setGoal(getPosition(rem(1), index), {
			tension: 250,
			friction: 22,
			mass: 1 + math.abs(index / 2),
		});
		sizeSpring.setGoal(getSize(rem(1), index === 0));
		transparencySpring.setGoal(hidden ? 1 : 0);
	}, [rem, index]);

	return (
		<ReactiveButton
			onClick={() => {
				if (!hidden) {
					onClick();
					playSound(sounds.navigate);
				}
			}}
			animateSizeStrength={2}
			animatePositionStrength={1.5}
			soundVariant="none"
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 1)}
			size={size}
			position={position}
			zIndex={-math.abs(index)}
		>
			<Shadow
				shadowColor={palette.secondary}
				shadowBlur={0.6}
				shadowSize={rem(7)}
				shadowPosition={rem(1)}
				shadowTransparency={transparency}
			/>

			<Image
				backgroundColor={palette.primary}
				backgroundTransparency={transparency}
				image={images.ui.skin_card_gradient}
				imageColor={palette.secondary}
				imageTransparency={transparency}
				cornerRadius={new UDim(0, rem(2.5))}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uistroke
					Color={palette.primary}
					Thickness={rem(0.5)}
					Transparency={transparency.map((t) => blend(t, 0.8))}
				/>
			</Image>

			<SkinThumbnail active={active} skin={palette.skin} transparency={transparency} />

			<SkinIndicator id={id} primary={palette.primary} transparency={transparency} />
		</ReactiveButton>
	);
}
