import { blend, lerp, map, useTimer } from "@rbxts/pretty-react-hooks";
import { composeBindings } from "@rbxts/pretty-react-hooks";
import React, { memo, useEffect, useMemo } from "@rbxts/react";
import { Image } from "client/components/ui/image";
import { Shadow } from "client/components/ui/shadow";
import { springs } from "client/constants/springs";
import { useMotion, useRem, useSeed } from "client/hooks";
import { images } from "shared/assets";
import { CandyType } from "shared/store/candy";
import { brighten } from "shared/utils/color-utils";
import { mapStrict } from "shared/utils/math-utils";

interface CandyItemProps {
	readonly variant: CandyType;
	readonly size: number;
	readonly point: Vector2;
	readonly color: Color3;
	readonly worldScale: React.Binding<number>;
	readonly eatenAt?: Vector2;
}

function CandyItemComponent({ variant, size, point, color, worldScale, eatenAt }: CandyItemProps) {
	const rem = useRem();
	const timer = useTimer();
	const seed = useSeed();

	const [pointSmooth, pointMotion] = useMotion(point);
	const [transition, transitionMotion] = useMotion(1);

	const { position, glow, transparency } = useMemo(() => {
		const position = timer.value.map((t) => {
			const noiseMultiplier = 1 - transition.getValue();
			const x = 4 * noiseMultiplier * math.noise(t, seed);
			const y = 4 * noiseMultiplier * math.noise(-seed, t);
			const point = pointSmooth.getValue();
			const scale = worldScale.getValue();

			return new UDim2(0, rem(point.X * scale + x), 0, rem(point.Y * scale + y));
		});

		const glow = timer.value.map((t) => {
			const diameter = map(math.noise(seed - 3 * t), -0.5, 0.5, 1, 4.5);
			return new UDim2(0, rem(diameter), 0, rem(diameter));
		});

		const transparency = composeBindings(timer.value, transition, (timer, transition) => {
			const flicker = map(math.noise(seed + 4 * timer), -0.5, 0.5, 0.4, 0.7);
			return lerp(flicker, 1, transition);
		});

		return { position, glow, transparency };
	}, [rem, worldScale]);

	const diameter = useMemo(() => {
		return variant === CandyType.Loot ? rem(2 + 1.5 * math.random()) : mapStrict(size, 1, 5, rem(0.75), rem(2));
	}, [variant, rem]);

	useEffect(() => {
		const position = eatenAt || point;

		pointMotion.spring(position, springs.world);
		transitionMotion.spring(eatenAt ? 1 : 0);
	}, [point, eatenAt]);

	return (
		<Image
			image={images.ui.circle}
			imageColor={brighten(color, 0.7, 0.7)}
			imageTransparency={transparency}
			size={new UDim2(0, diameter, 0, diameter)}
			position={position}
		>
			<Shadow
				shadowColor={brighten(color, 0.7)}
				shadowSize={glow}
				shadowTransparency={transparency.map((t) => blend(0.6, t))}
				shadowPosition={0}
			/>
		</Image>
	);
}

export const CandyItem = memo(CandyItemComponent);
