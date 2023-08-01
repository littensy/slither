import { spring } from "@rbxts/ripple";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { useMotion, useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { getPalette } from "./utils";

interface SkinCardProps {
	readonly id: string;
	readonly index: number;
	readonly onClick: () => void;
}

const SIZE = 12;
const SIZE_INACTIVE = 10;
const PADDING = 3;

function getPosition(rem: number, index: number) {
	const offset = math.sign(index) * (SIZE_INACTIVE - SIZE) * 0.5;
	const position = index * (SIZE + PADDING);

	return new UDim2(0.5, (position + offset) * rem, 1, 0);
}

function getSize(rem: number, active: boolean) {
	const sizeActive = new UDim2(0, SIZE * rem, 0, SIZE * rem);
	const sizeInactive = new UDim2(0, SIZE_INACTIVE * rem, 0, SIZE_INACTIVE * rem);

	return active ? sizeActive : sizeInactive;
}

export function SkinCard({ id, index, onClick }: SkinCardProps) {
	const palette = getPalette(id);

	const rem = useRem();
	const [position, positionMotion] = useMotion(getPosition(rem(1), index));
	const [size, sizeMotion] = useMotion(getSize(rem(1), false));

	useEffect(() => {
		positionMotion.spring(getPosition(rem(1), index));
		sizeMotion.spring(getSize(rem(1), index === 0));
	}, [rem, index]);

	return (
		<ReactiveButton
			onClick={onClick}
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 1)}
			size={size}
			position={position}
		>
			<Shadow key="drop-shadow" shadowColor={palette.secondary} />

			<Image
				key="background"
				backgroundColor={palette.primary}
				backgroundTransparency={0}
				image={images.ui.skin_card_gradient}
				imageColor={palette.secondary}
				cornerRadius={new UDim(0, rem(3))}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uistroke key="stroke" Color={palette.primary} Thickness={rem(0.5)} />
			</Image>
		</ReactiveButton>
	);
}
