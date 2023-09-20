import { blend } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { useMotion, useRem } from "client/app/hooks";
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
	const [position, positionMotion] = useMotion(getPosition(rem(1), math.sign(index) * 3));
	const [size, sizeMotion] = useMotion(getSize(rem(1), false));
	const [transparency, transparencyMotion] = useMotion(1);

	useEffect(() => {
		positionMotion.spring(getPosition(rem(1), index), {
			tension: 250,
			friction: 22,
			mass: 1 + math.abs(index / 2),
		});
		sizeMotion.spring(getSize(rem(1), index === 0));
		transparencyMotion.spring(hidden ? 1 : 0);
	}, [rem, index]);

	return (
		<ReactiveButton
			onClick={() => {
				if (!hidden) {
					onClick();
					playSound(sounds.sfx.navigate);
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
				key="drop-shadow"
				shadowColor={palette.secondary}
				shadowBlur={0.6}
				shadowSize={rem(7)}
				shadowPosition={rem(1)}
				shadowTransparency={transparency}
			/>

			<Image
				key="background"
				backgroundColor={palette.primary}
				backgroundTransparency={transparency}
				image={images.ui.skin_card_gradient}
				imageColor={palette.secondary}
				imageTransparency={transparency}
				cornerRadius={new UDim(0, rem(2.5))}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uistroke
					key="stroke"
					Color={palette.primary}
					Thickness={rem(0.5)}
					Transparency={transparency.map((t) => blend(t, 0.8))}
				/>
			</Image>

			<SkinThumbnail
				key="thumbnail"
				active={active}
				tints={palette.skin.tint}
				textures={palette.skin.texture}
				textureSize={palette.skin.size}
				transparency={transparency}
			/>

			<SkinIndicator key="indicator" id={id} primary={palette.primary} transparency={transparency} />
		</ReactiveButton>
	);
}
