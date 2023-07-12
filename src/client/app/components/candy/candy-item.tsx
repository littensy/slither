import { Spring, blend, map, useMotor, useTimer } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { Shadow } from "client/app/common/shadow";
import { useRem } from "client/app/hooks";
import { images } from "shared/assets";
import { getRandomAccent } from "shared/data/palette";
import { mapStrict } from "shared/utils/math-utils";

interface CandyItemProps {
	readonly size: number;
	readonly point: Vector2;
}

export function CandyItem({ size, point }: CandyItemProps) {
	const rem = useRem();
	const timer = useTimer();
	const seed = useMemo(() => 100 * math.random(), []);
	const color = useMemo(getRandomAccent, []);
	const [pointSmooth, setPointSmooth] = useMotor({ x: point.X, y: point.Y });

	const { position, glow, flash } = useMemo(() => {
		const position = timer.value.map((t) => {
			const x = 4 * math.noise(t, seed);
			const y = 4 * math.noise(-seed, t);
			const point = pointSmooth.getValue();

			return new UDim2(0, (point.x + x) * rem, 0, (point.y + y) * rem);
		});

		const glow = timer.value.map((t) => {
			const diameter = map(math.noise(seed - 3 * t), -0.5, 0.5, 0, 4);
			return new UDim2(0, diameter * rem, 0, diameter * rem);
		});

		const flash = timer.value.map((t) => {
			return map(math.noise(seed + 4 * t), -0.5, 0.5, 0.4, 0.7);
		});

		return { position, glow, flash };
	}, [rem]);

	const diameter = mapStrict(size, 0, 50, rem, 3 * rem);

	useEffect(() => {
		setPointSmooth({
			x: new Spring(point.X),
			y: new Spring(point.Y),
		});
	}, [point]);

	return (
		<Image
			image={images.common.circle}
			imageColor={color.Lerp(Color3.fromRGB(255, 255, 255), 0.7)}
			imageTransparency={flash}
			size={new UDim2(0, diameter, 0, diameter)}
			position={position}
		>
			<Shadow
				shadowColor={color}
				shadowSize={glow}
				shadowTransparency={flash.map((t) => blend(0.5, t))}
				shadowOffset={0}
			/>
		</Image>
	);
}
