import { Spring, useCamera, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useCallback, useEffect, useMemo } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { selectWorldCamera } from "client/store/world";
import { selectCandies } from "shared/store/candy";
import { CandyItem } from "./candy-item";

const CANDY_ON_SCREEN_MARGIN = 5;

export function Candy() {
	const rem = useRem();
	const camera = useCamera();

	const candy = useSelector(selectCandies);
	const world = useSelector(selectWorldCamera);

	const [smoothOffset, setSmoothOffset] = useMotor({
		x: world.offset.X,
		y: world.offset.Y,
	});

	const isOnScreen = useCallback(
		(point: Vector2) => {
			const margin = rem(new Vector2(CANDY_ON_SCREEN_MARGIN, CANDY_ON_SCREEN_MARGIN));
			const screen = camera.ViewportSize.add(margin.mul(2));

			const positionNotCentered = rem(point.mul(world.scale).add(world.offset.mul(world.scale)));
			const position = positionNotCentered.add(screen.mul(0.5));

			return position.X >= 0 && position.X <= screen.X && position.Y >= 0 && position.Y <= screen.Y;
		},
		[camera, world],
	);

	const children = useMemo(() => {
		let length = 0;

		return candy.mapFiltered((entity) => {
			if (length > 100 || !isOnScreen(entity.position)) {
				return;
			}

			length++;

			return (
				<CandyItem
					key={`candy-${entity.id}`}
					size={entity.size}
					point={entity.position.mul(world.scale)}
					color={entity.color}
					eatenAt={entity.eatenAt?.mul(world.scale)}
				/>
			);
		});
	}, [candy, isOnScreen]);

	useEffect(() => {
		setSmoothOffset({
			x: new Spring(world.offset.X),
			y: new Spring(world.offset.Y),
		});
	}, [world.offset]);

	return (
		<Group
			position={smoothOffset.map(
				(offset) => new UDim2(0.5, rem(offset.x * world.scale), 0.5, rem(offset.y * world.scale)),
			)}
		>
			{children}
		</Group>
	);
}
