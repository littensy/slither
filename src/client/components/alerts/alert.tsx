import { lerpBinding, useMountEffect } from "@rbxts/pretty-react-hooks";
import { composeBindings } from "@rbxts/pretty-react-hooks";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { dismissAlert } from "client/alerts";
import { Frame } from "client/components/ui/frame";
import { Image } from "client/components/ui/image";
import { Outline } from "client/components/ui/outline";
import { ReactiveButton } from "client/components/ui/reactive-button";
import { Shadow } from "client/components/ui/shadow";
import { Text } from "client/components/ui/text";
import { useMotion, useRem } from "client/hooks";
import { Alert, selectAlertIndex } from "client/store/alert";
import { selectIsMenuOpen } from "client/store/menu";
import { fonts } from "client/utils/fonts";
import { springs } from "client/utils/springs";
import { images, playSound, sounds } from "shared/assets";
import { palette } from "shared/constants/palette";
import { brightenIfDark, darken } from "shared/utils/color-utils";
import { mapStrict } from "shared/utils/math-utils";

import { AlertTimer } from "./alert-timer";

interface AlertProps {
	readonly alert: Alert;
	readonly index: number;
}

const MAX_VISIBLE_ALERTS = 5;
const ALERT_WIDTH = 35;
const ALERT_HEIGHT = 5;
const ALERT_PADDING = 2;
const LIST_PADDING = 1;

export function Alert({ alert, index }: AlertProps) {
	const rem = useRem();
	const menuOpen = useSelector(selectIsMenuOpen);
	const visibleIndex = useSelectorCreator(selectAlertIndex, alert.id);

	const [transition, transitionMotion] = useMotion(0);
	const [hover, hoverMotion] = useMotion(0);
	const [size, sizeMotion] = useMotion(new UDim2(0, ALERT_WIDTH / 2, 0, ALERT_HEIGHT / 2));
	const [position, positionMotion] = useMotion(new UDim2(0.5, 0, 0, rem(5)));

	const style = useMemo(() => {
		const highlight = composeBindings(hover, transition, (a, b) => a * b);
		const background = darken(alert.color.Lerp(palette.base, 0.25), 0.8);
		const backgroundSecondary = darken(alert.colorSecondary?.Lerp(palette.base, 0.25) || palette.white, 0.8);
		const message = brightenIfDark(alert.colorMessage || alert.color);

		return { highlight, background, backgroundSecondary, message };
	}, [alert, hover, transition]);

	const hasGradient = alert.colorSecondary !== undefined;

	const updateSize = (textWidth: number) => {
		const width = math.max(textWidth + rem(10), rem(ALERT_WIDTH));
		const height = rem(ALERT_HEIGHT);

		sizeMotion.spring(new UDim2(0, width, 0, height), springs.gentle);
	};

	useEffect(() => {
		transitionMotion.spring(alert.visible ? 1 : 0, springs.gentle);
	}, [alert.visible]);

	useEffect(() => {
		const position = (ALERT_HEIGHT + LIST_PADDING) * index;
		const offset = menuOpen ? 10 : 5;

		positionMotion.spring(new UDim2(0.5, 0, 0, rem(position + offset)), {
			tension: 180,
			friction: 12,
			mass: mapStrict(index, 0, MAX_VISIBLE_ALERTS, 1, 2),
		});
	}, [index, menuOpen, rem]);

	useEffect(() => {
		// Alerts that are dismissed are still in the list, but are invisible.
		// Do not count them towards the index of this alert to prevent it from
		// being dismissed early.
		if (visibleIndex >= MAX_VISIBLE_ALERTS) {
			dismissAlert(alert.id);
		}
	}, [visibleIndex]);

	useMountEffect(() => {
		playSound(alert.sound ?? sounds.alert_neutral);
	});

	return (
		<ReactiveButton
			onClick={() => {
				dismissAlert(alert.id);
				playSound(sounds.alert_dismiss);
			}}
			onHover={(hovered) => hoverMotion.spring(hovered ? 1 : 0, springs.responsive)}
			soundVariant="none"
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 0)}
			size={size}
			position={position}
		>
			<Shadow
				key="drop-shadow"
				shadowColor={hasGradient ? palette.white : lerpBinding(transition, alert.color, style.background)}
				shadowTransparency={lerpBinding(transition, 1, 0.3)}
				shadowSize={rem(3)}
			>
				{hasGradient && (
					<uigradient
						key="drop-shadow-gradient"
						Color={new ColorSequence(style.background, style.backgroundSecondary)}
					/>
				)}
			</Shadow>

			<Frame
				key="background"
				backgroundColor={hasGradient ? palette.white : style.background}
				backgroundTransparency={lerpBinding(transition, 1, 0.1)}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			>
				{hasGradient && (
					<uigradient
						key="background-gradient"
						Color={new ColorSequence(style.background, style.backgroundSecondary)}
					/>
				)}
			</Frame>

			<Frame
				key="highlight"
				backgroundColor={alert.color}
				backgroundTransparency={lerpBinding(style.highlight, 1, 0.9)}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Outline
				key="border"
				innerColor={hasGradient ? palette.white : alert.color}
				innerTransparency={lerpBinding(transition, 1, 0.85)}
				outerTransparency={lerpBinding(transition, 1, 0.75)}
				cornerRadius={new UDim(0, rem(1))}
			>
				{hasGradient && (
					<uigradient key="border-gradient" Color={new ColorSequence(alert.color, alert.colorSecondary)} />
				)}
			</Outline>

			<Text
				key="icon"
				font={fonts.inter.regular}
				text={alert.emoji}
				textColor={style.message}
				textTransparency={lerpBinding(transition, 1, 0)}
				textSize={rem(2)}
				textXAlignment="Left"
				textYAlignment="Center"
				position={new UDim2(0, rem(ALERT_PADDING), 0.5, 0)}
			/>

			<Text
				key="message"
				richText
				font={fonts.inter.medium}
				text={alert.message}
				textColor={style.message}
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
