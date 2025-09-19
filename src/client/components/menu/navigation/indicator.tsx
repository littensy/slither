import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useBinding, useEffect, useMemo } from "@rbxts/react";
import { useSelector } from "@rbxts/react-reflex";
import { RunService } from "@rbxts/services";
import { Frame } from "client/components/ui/frame";
import { Shadow } from "client/components/ui/shadow";
import { useRem, useSpring } from "client/hooks";
import { MenuPage, selectCurrentPage } from "client/store/menu";
import { map } from "shared/utils/math-utils";

interface IndicatorProps {
	readonly colors: readonly Color3[];
	readonly order: readonly MenuPage[];
}

export function Indicator({ colors, order }: IndicatorProps) {
	const rem = useRem();

	const page = useSelector(selectCurrentPage);
	const currentIndex = order.indexOf(page);
	const currentColor = colors[currentIndex];

	const [color, colorSpring] = useSpring(Color3.fromRGB(255, 255, 255));
	const [position, positionSpring] = useSpring(0);
	const [velocity, setVelocity] = useBinding(0);

	const style = useMemo(() => {
		return {
			position: position.map((x) => {
				return new UDim2(0.5, math.round(rem(x)), 0, 0);
			}),

			size: velocity.map((x) => {
				return new UDim2(0, math.round(rem(x * 0.05 + 4)), 0, rem(1));
			}),
		};
	}, [rem]);

	useEffect(() => {
		const x = map(currentIndex, 0, 2, -8, 8);
		positionSpring.setGoal(x, { tension: 240, friction: 25, mass: 1.5 });
	}, [page, rem]);

	useEffect(() => {
		colorSpring.setGoal(currentColor);
	}, [currentColor]);

	useEventListener(RunService.Heartbeat, () => {
		setVelocity(math.abs(positionSpring.getVelocity()));
	});

	return (
		<Frame
			backgroundColor={color}
			cornerRadius={new UDim(0.5, 0)}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={style.size}
			position={style.position}
		>
			<Shadow shadowPosition={rem(0)} shadowSize={rem(0)} shadowColor={color} shadowTransparency={0.8} />
		</Frame>
	);
}
