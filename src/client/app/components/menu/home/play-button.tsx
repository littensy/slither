import { lerpBinding, useTimer } from "@rbxts/pretty-react-hooks";
import { spring } from "@rbxts/ripple";
import Roact from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useMotion, useRem } from "client/app/hooks";
import { fonts } from "client/app/utils/fonts";
import { palette } from "shared/data/palette";
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

	const shimmer = timer.value.map((t) => {
		return 30 * t;
	});

	const onClick = () => {
		remotes.snake.spawn.fire();
	};

	return (
		<ReactiveButton
			onClick={onClick}
			onHover={(hovered) => hoverMotion.spring(hovered ? 1 : 0)}
			backgroundTransparency={1}
			anchorPoint={anchorPoint}
			size={size}
			position={position}
		>
			<Shadow
				shadowColor={Color3.fromRGB(255, 255, 255)}
				shadowTransparency={lerpBinding(hover, 0.2, 0)}
				shadowSize={rem(1.25)}
				shadowPosition={rem(0.25)}
			>
				<uigradient Color={gradient} Rotation={shimmer} />
			</Shadow>

			<Frame
				backgroundColor={palette.white0}
				backgroundTransparency={lerpBinding(hover, 0.1, 0)}
				cornerRadius={new UDim(0, rem(0.5))}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uigradient Transparency={new NumberSequence(0, 0.4)} Rotation={90} />
				<uistroke Color={palette.subtext0} Transparency={0.5} Thickness={rem(0.25)} />
			</Frame>

			<Text
				font={fonts.inter.medium}
				text="Start Playing →"
				textColor={palette.mantle}
				textSize={rem(1.4)}
				size={new UDim2(1, 0, 1, 0)}
			/>
		</ReactiveButton>
	);
}
