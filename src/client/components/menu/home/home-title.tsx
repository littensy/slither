import { useTimer } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Image } from "client/components/ui/image";
import { useRem } from "client/hooks";
import { images } from "shared/assets";

import { gradientPinched } from "./utils";

interface HomeTitleProps {
	readonly position: UDim2;
}

export function HomeTitle({ position }: HomeTitleProps) {
	const rem = useRem();
	const timer = useTimer();
	const rotation = timer.value.map((t) => (t * 45) % 360);

	return (
		<Image
			image={images.ui.menu_title}
			scaleType="Fit"
			anchorPoint={new Vector2(0.5, 0.5)}
			size={new UDim2(0, rem(30), 0, rem(20))}
			position={position}
		>
			<uiaspectratioconstraint AspectRatio={1014 / 544} />
			<uigradient Color={gradientPinched} Rotation={rotation} />
		</Image>
	);
}
