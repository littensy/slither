import { Spring, blend, joinAnyBindings, lerpBinding, useMotor, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useButtonAnimation, useButtonState, useRem } from "../hooks";
import { Button } from "./button";
import { Frame } from "./frame";

interface PrettyButtonProps extends Roact.PropsWithChildren {
	onClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	enabled?: boolean;
	size?: UDim2 | Roact.Binding<UDim2>;
	position?: UDim2 | Roact.Binding<UDim2>;
	anchorPoint?: Vector2 | Roact.Binding<Vector2>;
	backgroundColor?: Color3 | Roact.Binding<Color3>;
	backgroundTransparency?: number | Roact.Binding<number>;
	cornerRadius?: UDim | Roact.Binding<UDim>;
	layoutOrder?: number | Roact.Binding<number>;
	animatePosition?: boolean;
	animatePositionStrength?: number;
	animatePositionDirection?: Vector2;
	animateSize?: boolean;
	animateSizeStrength?: number;
	zIndex?: number | Roact.Binding<number>;
	event?: Roact.JsxInstanceEvents<TextButton>;
	change?: Roact.JsxInstanceChangeEvents<TextButton>;
}

export function PrettyButton({
	onClick,
	onMouseDown,
	onMouseUp,
	onMouseEnter,
	onMouseLeave,
	enabled = true,
	size,
	position,
	anchorPoint,
	backgroundColor = Color3.fromRGB(255, 255, 255),
	backgroundTransparency = 0,
	cornerRadius,
	layoutOrder,
	zIndex,
	animatePosition = true,
	animatePositionStrength = 1,
	animatePositionDirection = new Vector2(0, 1),
	animateSize = true,
	animateSizeStrength = 1,
	event = {},
	change = {},
	children,
}: PrettyButtonProps) {
	const rem = useRem();
	const [sizeAnimation, setSizeAnimation, sizeAnimationApi] = useMotor(0);
	const [press, hover, buttonEvents] = useButtonState();
	const animation = useButtonAnimation(press, hover);

	useUpdateEffect(() => {
		if (press) {
			setSizeAnimation(new Spring(-0.1));
		} else {
			sizeAnimationApi.setState({ velocity: 30 });
			setSizeAnimation(new Spring(0));
		}
	}, [press]);

	return (
		<Button
			onClick={enabled ? onClick : undefined}
			active={enabled}
			onMouseDown={() => {
				if (!enabled) return;
				buttonEvents.onMouseDown();
				onMouseDown?.();
			}}
			onMouseUp={() => {
				if (!enabled) return;
				buttonEvents.onMouseUp();
				onMouseUp?.();
			}}
			onMouseEnter={() => {
				buttonEvents.onMouseEnter();
				onMouseEnter?.();
			}}
			onMouseLeave={() => {
				buttonEvents.onMouseLeave();
				onMouseLeave?.();
			}}
			backgroundTransparency={1}
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			layoutOrder={layoutOrder}
			zIndex={zIndex}
			event={event}
			change={change}
		>
			<Frame
				backgroundColor={joinAnyBindings([animation.hoverOnly, animation.press, backgroundColor] as const).map(
					([hover, press, color]) => {
						return color.Lerp(new Color3(1, 1, 1), hover * 0.15).Lerp(new Color3(), press * 0.1);
					},
				)}
				backgroundTransparency={joinAnyBindings([animation.press, backgroundTransparency] as const).map(
					([t, transparency]) => {
						return blend(-t * 0.2, transparency);
					},
				)}
				cornerRadius={cornerRadius}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={lerpBinding(
					animateSize ? sizeAnimation : 0,
					new UDim2(1, 0, 1, 0),
					new UDim2(1, 2 * rem * animateSizeStrength, 1, 2 * rem * animateSizeStrength),
				)}
				position={lerpBinding(
					animatePosition ? animation.position : 0,
					new UDim2(0.5, 0, 0.5, 0),
					new UDim2(
						0.5,
						(3 + 0.1 * rem) * animatePositionStrength * animatePositionDirection.X,
						0.5,
						(3 + 0.1 * rem) * animatePositionStrength * animatePositionDirection.Y,
					),
				)}
			>
				{children}
			</Frame>
		</Button>
	);
}
