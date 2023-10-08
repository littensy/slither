import { blend, lerpBinding } from "@rbxts/pretty-react-hooks";
import { composeBindings } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { images } from "shared/assets";
import { palette } from "shared/constants/palette";

import { useMotion, useRem } from "../../hooks";
import { Frame } from "./frame";
import { Image } from "./image";
import { Outline } from "./outline";
import { ReactiveButton } from "./reactive-button";
import { Shadow } from "./shadow";

interface PrimaryButtonProps extends Roact.PropsWithChildren {
	readonly onClick?: () => void;
	readonly onHover?: (hovered: boolean) => void;
	readonly size?: UDim2 | Roact.Binding<UDim2>;
	readonly position?: UDim2 | Roact.Binding<UDim2>;
	readonly anchorPoint?: Vector2 | Roact.Binding<Vector2>;
	readonly overlayGradient?: ColorSequence | Roact.Binding<ColorSequence>;
	readonly overlayTransparency?: number | Roact.Binding<number>;
	readonly overlayRotation?: number | Roact.Binding<number>;
	readonly layoutOrder?: number | Roact.Binding<number>;
}

export function PrimaryButton({
	onClick,
	onHover,
	size,
	position,
	anchorPoint,
	overlayGradient,
	overlayTransparency = 0,
	overlayRotation,
	layoutOrder,
	children,
}: PrimaryButtonProps) {
	const rem = useRem();
	const [hover, hoverMotion] = useMotion(0);

	return (
		<ReactiveButton
			onClick={onClick}
			onHover={(hovered) => {
				hoverMotion.spring(hovered ? 1 : 0);
				onHover?.(hovered);
			}}
			backgroundTransparency={1}
			anchorPoint={anchorPoint}
			size={size}
			position={position}
			layoutOrder={layoutOrder}
		>
			<Shadow
				key="drop-shadow"
				shadowSize={rem(2.5)}
				shadowBlur={0.2}
				shadowTransparency={lerpBinding(hover, 0.7, 0.4)}
				shadowPosition={rem(0.5)}
			/>

			<Frame
				key="background"
				backgroundColor={palette.white}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uigradient
					key="background-gradient"
					Offset={lerpBinding(hover, new Vector2(), new Vector2(0, 1))}
					Rotation={90}
					Transparency={new NumberSequence(0, 0.1)}
				/>
			</Frame>

			<Outline key="button-outline" cornerRadius={new UDim(0, rem(1))} innerTransparency={0} />

			<Image
				key="glow-overlay"
				image={images.ui.button_glow_top}
				imageTransparency={composeBindings(overlayTransparency, lerpBinding(hover, 0.3, 0), blend)}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uigradient key="gradient" Color={overlayGradient} Rotation={overlayRotation} />
			</Image>

			{children}
		</ReactiveButton>
	);
}
