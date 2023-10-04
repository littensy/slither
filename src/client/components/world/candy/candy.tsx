import { useSelector } from "@rbxts/react-reflex";
import Roact, { useBinding, useEffect, useMemo } from "@rbxts/roact";
import { Group } from "client/components/ui/group";
import { useMotion, useRem } from "client/hooks";
import { selectWorldCamera } from "client/store/world";
import { springs } from "client/utils/springs";

import { CandyItem } from "./candy-item";
import { useCandyOnScreen } from "./use-candy-on-screen";

export function Candy() {
	const rem = useRem();
	const world = useSelector(selectWorldCamera);
	const candyOnScreen = useCandyOnScreen(world.offset, world.scale);

	const [smoothOffset, offsetMotion] = useMotion(world.offset);
	const [scale, setScale] = useBinding(world.scale);

	const children = useMemo(() => {
		let length = 0;

		return candyOnScreen.mapFiltered((entity) => {
			if (length > 200) {
				return;
			}

			length++;

			return (
				<CandyItem
					key={`candy-${entity.id}`}
					variant={entity.type}
					size={entity.size}
					point={entity.position}
					color={entity.color}
					eatenAt={entity.eatenAt}
					worldScale={scale}
				/>
			);
		});
	}, [candyOnScreen]);

	useEffect(() => {
		offsetMotion.spring(world.offset, springs.world);
	}, [world.offset]);

	useEffect(() => {
		setScale(world.scale);
	}, [world.scale]);

	return (
		<Group
			position={smoothOffset.map(
				(offset) => new UDim2(0.5, rem(offset.X * world.scale), 0.5, rem(offset.Y * world.scale)),
			)}
		>
			{children}
		</Group>
	);
}
