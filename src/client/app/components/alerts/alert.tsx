import { lerpBinding } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { dismissAlert } from "client/alert";
import { Frame } from "client/app/common/frame";
import { Image } from "client/app/common/image";
import { Outline } from "client/app/common/outline";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useMotion, useRem } from "client/app/hooks";
import { brightenIfDark, darken } from "client/app/utils/color-utils";
import { composeBindings } from "client/app/utils/compose-bindings";
import { fonts } from "client/app/utils/fonts";
import { springs } from "client/app/utils/springs";
import { Alert } from "client/store/alert";
import { images } from "shared/assets";
import { palette } from "shared/data/palette";
import { mapStrict } from "shared/utils/math-utils";

import { AlertTimer } from "./alert-timer";

interface AlertProps {
	readonly alert: Alert;
	readonly index: number;
}

const MAX_ALERTS = 4;
const ALERT_WIDTH = 35;
const ALERT_HEIGHT = 5;
const ALERT_PADDING = 2;
const LIST_PADDING = 1;

export function Alert({ alert, index }: AlertProps) {
	const rem = useRem();
	const [transition, transitionMotion] = useMotion(0);
	const [hover, hoverMotion] = useMotion(0);
	const [size, sizeMotion] = useMotion(new UDim2(0, ALERT_WIDTH / 2, 0, ALERT_HEIGHT / 2));
	const [position, positionMotion] = useMotion(new UDim2(0.5, 0, 0, rem(5)));

	const updateSize = (textWidth: number) => {
		const width = math.max(textWidth + rem(10), rem(ALERT_WIDTH));
		const height = rem(ALERT_HEIGHT);

		sizeMotion.spring(new UDim2(0, width, 0, height), springs.gentle);
	};

	const isGradient = alert.colorSecondary !== undefined;
	const highlight = composeBindings(hover, transition, (a, b) => a * b);
	const backgroundColor = darken(alert.color.Lerp(palette.base, 0.25), 0.5);
	const backgroundColorSecondary = darken(alert.colorSecondary?.Lerp(palette.base, 0.25) || palette.white, 0.5);
	const messageColor = brightenIfDark(alert.colorMessage || alert.color);

	useEffect(() => {
		transitionMotion.spring(alert.visible ? 1 : 0, springs.gentle);
	}, [alert.visible]);

	useEffect(() => {
		const offset = (ALERT_HEIGHT + LIST_PADDING) * index;

		positionMotion.spring(new UDim2(0.5, 0, 0, rem(offset + 10)), {
			tension: 180,
			friction: 12,
			mass: mapStrict(index, 0, MAX_ALERTS, 1, 2),
		});

		if (index >= MAX_ALERTS) {
			dismissAlert(alert.id);
		}
	}, [index, rem]);

	return (
		<ReactiveButton
			onClick={() => dismissAlert(alert.id)}
			onHover={(hovered) => hoverMotion.spring(hovered ? 1 : 0, springs.responsive)}
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 0)}
			size={size}
			position={position}
		>
			<Shadow
				key="drop-shadow"
				shadowColor={isGradient ? palette.white : lerpBinding(transition, alert.color, backgroundColor)}
				shadowTransparency={lerpBinding(transition, 1, 0.3)}
				shadowSize={rem(3)}
			>
				{isGradient && (
					<uigradient
						key="drop-shadow-gradient"
						Color={new ColorSequence(backgroundColor, backgroundColorSecondary)}
					/>
				)}
			</Shadow>

			<Frame
				key="background"
				backgroundColor={isGradient ? palette.white : backgroundColor}
				backgroundTransparency={lerpBinding(transition, 1, 0.1)}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			>
				{isGradient && (
					<uigradient
						key="background-gradient"
						Color={new ColorSequence(backgroundColor, backgroundColorSecondary)}
					/>
				)}
			</Frame>

			<Frame
				key="highlight"
				backgroundColor={alert.color}
				backgroundTransparency={lerpBinding(highlight, 1, 0.9)}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Outline
				key="border"
				innerColor={isGradient ? palette.white : alert.color}
				innerTransparency={lerpBinding(transition, 1, 0.85)}
				outerTransparency={lerpBinding(transition, 1, 0.75)}
				cornerRadius={new UDim(0, rem(1))}
			>
				{isGradient && (
					<uigradient key="border-gradient" Color={new ColorSequence(alert.color, alert.colorSecondary)} />
				)}
			</Outline>

			<Text
				key="icon"
				font={fonts.inter.regular}
				text={alert.emoji}
				textColor={messageColor}
				textTransparency={lerpBinding(transition, 1, 0)}
				textSize={rem(2)}
				textXAlignment="Left"
				textYAlignment="Center"
				position={new UDim2(0, rem(ALERT_PADDING), 0.5, 0)}
			/>

			<Text
				key="message"
				font={fonts.inter.medium}
				text={alert.message}
				textColor={messageColor}
				textTransparency={lerpBinding(transition, 1, 0)}
				textSize={rem(1.5)}
				textXAlignment="Left"
				textYAlignment="Center"
				anchorPoint={new Vector2(0, 0.5)}
				size={new UDim2(1, rem(-ALERT_PADDING * 2), 1, 0)}
				position={new UDim2(0, rem(ALERT_PADDING + 3), 0.5, 0)}
				clipsDescendants
				change={{
					TextBounds: (rbx) => updateSize(rbx.TextBounds.X),
				}}
			/>

			<Image
				key="close"
				image={images.ui.alert_dismiss}
				imageColor={brightenIfDark(alert.colorSecondary || alert.colorMessage || alert.color)}
				imageTransparency={lerpBinding(transition, 1, 0)}
				anchorPoint={new Vector2(1, 0.5)}
				size={new UDim2(0, rem(1), 0, rem(1))}
				position={new UDim2(1, rem(-ALERT_PADDING), 0.5, 0)}
			/>

			<AlertTimer
				key="timer"
				duration={alert.duration}
				color={alert.color}
				colorSecondary={alert.colorSecondary}
				transparency={lerpBinding(transition, 1, 0)}
			/>
		</ReactiveButton>
	);
}
