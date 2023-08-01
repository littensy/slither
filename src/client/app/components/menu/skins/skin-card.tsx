import { spring } from "@rbxts/ripple";
import Roact, { useEffect } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useMotion, useRem } from "client/app/hooks";
import { getPalette } from "./utils";

interface SkinCardProps {
	readonly id: string;
	readonly index: number;
	readonly onClick: () => void;
}

const SIZE = 12;
const SIZE_INACTIVE = 10;
const PADDING = 3;

export function SkinCard({ id, index, onClick }: SkinCardProps) {
	const palette = getPalette(id);

	const rem = useRem();

	const getPosition = (index: number) => {
		const offset = math.sign(index) * (SIZE_INACTIVE - SIZE) * 0.5;
		const position = index * (SIZE + PADDING);

		return new UDim2(0.5, rem(position + offset), 1, 0);
	};

	const getSize = (active: boolean) => {
		const sizeActive = new UDim2(0, rem(SIZE), 0, rem(SIZE));
		const sizeInactive = new UDim2(0, rem(SIZE_INACTIVE), 0, rem(SIZE_INACTIVE));

		return active ? sizeActive : sizeInactive;
	};

	const [position, positionMotion] = useMotion(getPosition(index));
	const [size, sizeMotion] = useMotion(getSize(false));

	useEffect(() => {
		positionMotion.spring(getPosition(index));
		sizeMotion.spring(getSize(index === 0));
	}, [index]);

	return (
		<Group anchorPoint={new Vector2(0.5, 1)} size={size} position={position}>
			{/* todo */}
		</Group>
	);
}
