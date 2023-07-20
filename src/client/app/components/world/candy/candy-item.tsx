import { Spring, blend, lerp, map, useMotor, useTimer } from "@rbxts/pretty-react-hooks";
import Roact, { joinBindings, memo, useEffect, useMemo } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { Shadow } from "client/app/common/shadow";
import { useRem, useSeed } from "client/app/hooks";
import { images } from "shared/assets";
import { mapStrict } from "shared/utils/math-utils";

interface CandyItemProps {
	readonly size: number;
	readonly point: Vector2;
	readonly color: Color3;
	readonly eatenAt?: Vector2;
}

function CandyItemComponent({ size, point, color, eatenAt }: CandyItemProps) {
	const rem = useRem();
	const timer = useTimer();
	const seed = useSeed();

	const [pointSmooth, setPointSmooth] = useMotor({ x: point.X, y: point.Y });
	const [transition, setTransition] = useMotor(1);

	const { position, glow, transparency } = useMemo(() => {
		const position = timer.value.map((t) => {
			const x = 4 * math.noise(t, seed);
			const y = 4 * math.noise(-seed, t);
			const point = pointSmooth.getValue();

			return new UDim2(0, rem(point.x + x), 0, rem(point.y + y));
		});

		const glow = timer.value.map((t) => {
			const diameter = map(math.noise(seed - 3 * t), -0.5, 0.5, 0, 4);
			return new UDim2(0, rem(diameter), 0, rem(diameter));
		});

		const transparency = joinBindings([timer.value, transition]).map(([timer, transition]) => {
			const flicker = map(math.noise(seed + 4 * timer), -0.5, 0.5, 0.4, 0.7);
			return lerp(flicker, 1, transition);
		});

		return { position, glow, transparency };
	}, [rem]);

	const diameter = mapStrict(size, 1, 20, rem(0.75), rem(3.5));

	useEffect(() => {
		const position = eatenAt || point;

		setPointSmooth({
			x: new Spring(position.X),
			y: new Spring(position.Y),
		});

		setTransition(new Spring(eatenAt ? 1 : 0));
	}, [point, eatenAt]);

	return (
		<Image
			image={images.ui.circle}
			imageColor={color.Lerp(Color3.fromRGB(255, 255, 255), 0.7)}
			imageTransparency={transparency}
			size={new UDim2(0, diameter, 0, diameter)}
			position={position}
		>
			<Shadow
				shadowColor={color}
				shadowSize={glow}
				shadowTransparency={transparency.map((t) => blend(0.5, t))}
				shadowOffset={0}
			/>
		</Image>
	);
}

export const CandyItem = memo(CandyItemComponent);
