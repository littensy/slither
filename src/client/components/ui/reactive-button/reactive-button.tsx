import { blend, lerpBinding, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import { composeBindings } from "@rbxts/pretty-react-hooks";
import React from "@rbxts/react";
import { useRem, useSpring } from "client/hooks";
import { ButtonSoundVariant, playButtonDown, playButtonUp } from "shared/assets";

import { Button } from "../button";
import { Frame } from "../frame";
import { useButtonAnimation } from "./use-button-animation";
import { useButtonState } from "./use-button-state";

interface ReactiveButtonProps extends React.PropsWithChildren {
	onClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onHover?: (hovered: boolean) => void;
	onPress?: (pressed: boolean) => void;
	enabled?: boolean;
	size?: UDim2 | React.Binding<UDim2>;
	position?: UDim2 | React.Binding<UDim2>;
	anchorPoint?: Vector2 | React.Binding<Vector2>;
	backgroundColor?: Color3 | React.Binding<Color3>;
	backgroundTransparency?: number | React.Binding<number>;
	cornerRadius?: UDim | React.Binding<UDim>;
	layoutOrder?: number | React.Binding<number>;
	animatePosition?: boolean;
	animatePositionStrength?: number;
	animatePositionDirection?: Vector2;
	animateSize?: boolean;
	animateSizeStrength?: number;
	soundVariant?: ButtonSoundVariant;
	zIndex?: number | React.Binding<number>;
	event?: React.InstanceEvent<TextButton>;
	change?: React.InstanceChangeEvent<TextButton>;
}

export function ReactiveButton({
	onClick,
	onMouseDown,
	onMouseUp,
	onMouseEnter,
	onMouseLeave,
	onHover,
	onPress,
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
	soundVariant = "default",
	event,
	change,
	children,
}: ReactiveButtonProps) {
	const rem = useRem();
	const [sizeAnimation, sizeSpring] = useSpring(0);
	const [press, hover, buttonEvents] = useButtonState();
	const animation = useButtonAnimation(press, hover);

	useUpdateEffect(() => {
		if (press) {
			sizeSpring.setGoal(-0.1, { tension: 300 });
		} else {
			sizeSpring.setGoal(0, { impulse: 10, tension: 300 });
		}
	}, [press]);

	useUpdateEffect(() => {
		onHover?.(hover);
	}, [hover]);

	useUpdateEffect(() => {
		onPress?.(press);
	}, [press]);

	return (
		<Button
			onClick={enabled ? onClick : undefined}
			active={enabled}
			onMouseDown={() => {
				if (!enabled) return;
				buttonEvents.onMouseDown();
				onMouseDown?.();
				playButtonDown(soundVariant);
			}}
			onMouseUp={() => {
				if (!enabled) return;
				buttonEvents.onMouseUp();
				onMouseUp?.();
				playButtonUp(soundVariant);
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
				backgroundColor={composeBindings(
					animation.hoverOnly,
					animation.press,
					backgroundColor,
					(hover, press, color) => {
						return color.Lerp(new Color3(1, 1, 1), hover * 0.15).Lerp(new Color3(), press * 0.1);
					},
				)}
				backgroundTransparency={composeBindings(
					animation.press,
					backgroundTransparency,
					(press, transparency) => {
						return blend(-press * 0.2, transparency);
					},
				)}
				cornerRadius={cornerRadius}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={lerpBinding(
					animateSize ? sizeAnimation : 0,
					new UDim2(1, 0, 1, 0),
					new UDim2(1, rem(2 * animateSizeStrength), 1, rem(2 * animateSizeStrength)),
				)}
				position={lerpBinding(
					animatePosition ? animation.position : 0,
					new UDim2(0.5, 0, 0.5, 0),
					new UDim2(
						0.5,
						(3 + rem(0.1)) * animatePositionStrength * animatePositionDirection.X,
						0.5,
						(3 + rem(0.1)) * animatePositionStrength * animatePositionDirection.Y,
					),
				)}
			>
				{children}
			</Frame>
		</Button>
	);
}
