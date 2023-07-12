import { Spring, useCamera, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useRem } from "client/app/hooks";
import { selectWorldCamera } from "client/store/world";
import { selectStaticCandies } from "shared/store/candy";
import { CandyItem } from "./candy-item";

const CANDY_ON_SCREEN_MARGIN = 5;

export function Candy() {
	const rem = useRem();
	const camera = useCamera();
	const candy = useSelector(selectStaticCandies);
	const world = useSelector(selectWorldCamera);
	const [smoothOffset, setSmoothOffset] = useMotor({ x: world.offset.X, y: world.offset.Y });

	useEffect(() => {
		setSmoothOffset({
			x: new Spring(world.offset.X),
			y: new Spring(world.offset.Y),
		});
	}, [world.offset]);

	const isOnScreen = (point: Vector2) => {
		const margin = new Vector2(CANDY_ON_SCREEN_MARGIN, CANDY_ON_SCREEN_MARGIN).mul(rem);
		const screen = camera.ViewportSize.add(margin.mul(2));

		const positionNotCentered = point.mul(rem * world.scale).add(world.offset.mul(rem * world.scale));
		const position = positionNotCentered.add(screen.mul(0.5));

		return position.X >= 0 && position.X <= screen.X && position.Y >= 0 && position.Y <= screen.Y;
	};

	return (
		<Group
			position={smoothOffset.map(
				(offset) => new UDim2(0.5, offset.x * rem * world.scale, 0.5, offset.y * rem * world.scale),
			)}
		>
			{candy.mapFiltered((entity) => {
				if (!isOnScreen(entity.position)) {
					return;
				}

				return (
					<CandyItem
						key={`candy-${entity.id}`}
						size={entity.size}
						point={entity.position.mul(world.scale)}
						color={entity.color}
						eatenAt={entity.eatenAt}
					/>
				);
			})}
		</Group>
	);
}
