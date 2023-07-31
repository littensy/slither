import { useSelector } from "@rbxts/react-reflex";
import { spring } from "@rbxts/ripple";
import Roact, { useBinding, useEffect, useMemo } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useMotion, useRem } from "client/app/hooks";
import { springs } from "client/app/utils/springs";
import { selectWorldCamera } from "client/store/world";
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
		offsetMotion.to(spring(world.offset, springs.world));
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
