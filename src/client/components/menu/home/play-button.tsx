import { lerpBinding, useTimer } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { Outline } from "client/components/ui/outline";
import { PrimaryButton } from "client/components/ui/primary-button";
import { Shadow } from "client/components/ui/shadow";
import { Text } from "client/components/ui/text";
import { fonts } from "client/constants/fonts";
import { useMotion, useRem } from "client/hooks";
import { palette } from "shared/constants/palette";
import { remotes } from "shared/remotes";

import { gradient } from "./utils";

interface PlayButtonProps {
	readonly anchorPoint: Vector2;
	readonly size: UDim2;
	readonly position: UDim2;
}

export function PlayButton({ anchorPoint, size, position }: PlayButtonProps) {
	const rem = useRem();
	const timer = useTimer();
	const [hover, hoverMotion] = useMotion(0);

	const gradientSpin = timer.value.map((t) => {
		return 30 * t;
	});

	const onClick = () => {
		remotes.snake.spawn.fire();
	};

	return (
		<PrimaryButton
			onClick={onClick}
			onHover={(hovered) => hoverMotion.spring(hovered ? 1 : 0)}
			overlayGradient={new ColorSequence(palette.mauve, palette.blue)}
			anchorPoint={anchorPoint}
			size={size}
			position={position}
		>
			<Shadow
				shadowColor={palette.white}
				shadowTransparency={lerpBinding(hover, 0.2, 0)}
				shadowSize={rem(1.5)}
				shadowPosition={rem(0.25)}
				zIndex={0}
			>
				<uigradient Color={gradient} Rotation={gradientSpin} />
			</Shadow>

			<Text
				font={fonts.inter.medium}
				text="Start Playing →"
				textColor={palette.mantle}
				textSize={rem(1.5)}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Outline cornerRadius={new UDim(0, rem(1))} innerTransparency={0} />
		</PrimaryButton>
	);
}
