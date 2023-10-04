import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { composeBindings } from "@rbxts/pretty-react-hooks";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { sendAlert } from "client/alerts";
import { PrimaryButton } from "client/components/ui/primary-button";
import { Shadow } from "client/components/ui/shadow";
import { Text } from "client/components/ui/text";
import { useMotion, useRem } from "client/hooks";
import { selectMenuCurrentSkin } from "client/store/menu";
import { fonts } from "client/utils/fonts";
import { formatInteger } from "client/utils/format-integer";
import { springs } from "client/utils/springs";
import { sounds } from "shared/assets";
import { USER_NAME } from "shared/constants/core";
import { palette } from "shared/constants/palette";
import { findSnakeSkin } from "shared/constants/skins";
import { remotes } from "shared/remotes";
import { RANDOM_SKIN, selectCurrentPlayerSkin, selectPlayerBalance, selectPlayerSkins } from "shared/store/saves";
import { darken } from "shared/utils/color-utils";

interface Status {
	readonly variant: "buy" | "not-enough-money" | "wear" | "wearing" | "none";
	readonly price?: number;
}

const darkGreen = darken(palette.green, 0.5, 0.5);
const darkRed = darken(palette.red, 0.25, 0.5);
const darkBlue = darken(palette.blue, 0.25, 0.5);
const darkPeach = darken(palette.peach, 0.25, 0.5);

function stylize(text: unknown, color: Color3) {
	if (text === `"${RANDOM_SKIN}"`) {
		text = '"random"';
	}

	return `<font color="#${color.ToHex()}">${text}</font>`;
}

function getStatus(equipped: string, current: string, inventory: readonly string[] = [], balance = 0): Status {
	const equippedSkin = findSnakeSkin(equipped);
	const currentSkin = findSnakeSkin(current);
	const ownsCurrentSkin = inventory.includes(current);

	if (equippedSkin === currentSkin) {
		return { variant: "wearing" };
	} else if (!ownsCurrentSkin && currentSkin) {
		return {
			variant: balance >= currentSkin.price ? "buy" : "not-enough-money",
			price: currentSkin.price,
		};
	} else if (ownsCurrentSkin) {
		return { variant: "wear" };
	} else {
		return { variant: "none" };
	}
}

export function ActButton() {
	const rem = useRem();
	const equippedSkin = useSelectorCreator(selectCurrentPlayerSkin, USER_NAME) ?? RANDOM_SKIN;
	const currentSkin = useSelector(selectMenuCurrentSkin);
	const inventory = useSelectorCreator(selectPlayerSkins, USER_NAME);
	const balance = useSelectorCreator(selectPlayerBalance, USER_NAME);
	const status = getStatus(equippedSkin, currentSkin, inventory, balance);

	const [primary, primaryMotion] = useMotion(new Color3());
	const [secondary, secondaryMotion] = useMotion(new Color3());
	const [textWidth, textWidthMotion] = useMotion(0);
	const [gradientSpin, gradientSpinMotion] = useMotion(0);
	const [hover, hoverMotion] = useMotion(0);

	const { size, gradient } = useMemo(() => {
		const size = textWidth.map((width) => {
			return new UDim2(0, width + rem(3), 0, rem(4.5));
		});

		const gradient = composeBindings(primary, secondary, (primary, secondary) => {
			return new ColorSequence(primary, secondary);
		});

		return { size, gradient };
	}, [rem]);

	const onClick = () => {
		gradientSpinMotion.spring(gradientSpin.getValue() + 180, springs.molasses);

		if (status.variant === "buy") {
			remotes.save.buySkin.fire(currentSkin);
		} else if (status.variant === "wear") {
			remotes.save.setSkin.fire(currentSkin);
		} else if (status.variant === "not-enough-money") {
			sendAlert({
				emoji: "🚨",
				color: palette.red,
				message: `Sorry, you cannot afford the ${stylize(currentSkin, palette.white)} skin yet.`,
				sound: sounds.alert_bad,
			});
		}
	};

	useEffect(() => {
		switch (status.variant) {
			case "wearing":
				primaryMotion.spring(palette.red);
				secondaryMotion.spring(palette.peach);
				break;
			case "wear":
				primaryMotion.spring(palette.blue);
				secondaryMotion.spring(palette.mauve);
				break;
			case "buy":
				primaryMotion.spring(palette.teal);
				secondaryMotion.spring(palette.green);
				break;
			case "not-enough-money":
			case "none":
				primaryMotion.spring(palette.red);
				secondaryMotion.spring(palette.red);
				break;
		}
	}, [status.variant]);

	const text =
		status.variant === "buy"
			? `💵  Buy ${stylize(`"${currentSkin}"`, darkGreen)} for ${stylize(
					"$" + formatInteger(status.price),
					darkGreen,
			  )}`
			: status.variant === "wear"
			? `🎨  Wear ${stylize(`"${currentSkin}"`, darkBlue)}`
			: status.variant === "wearing"
			? `🎨  Wearing ${stylize(`"${currentSkin}"`, darkPeach)}`
			: status.variant === "not-enough-money"
			? `🔒  ${stylize(`"${currentSkin}"`, darkRed)} costs ${stylize("$" + formatInteger(status.price), darkRed)}`
			: "🔒  Locked";

	return (
		<PrimaryButton
			onClick={onClick}
			onHover={(hovered) => hoverMotion.spring(hovered ? 1 : 0)}
			overlayGradient={gradient}
			overlayRotation={gradientSpin}
			anchorPoint={new Vector2(0.5, 1)}
			size={size}
			position={new UDim2(0.5, 0, 1, -rem(19))}
		>
			<Shadow
				key="glow-background"
				shadowColor={palette.white}
				shadowTransparency={lerpBinding(hover, 0.5, 0.2)}
				shadowSize={rem(1)}
				shadowPosition={rem(-0.25)}
				zIndex={0}
			>
				<uigradient key="gradient" Color={gradient} Rotation={gradientSpin} />
			</Shadow>

			<Text
				key="text"
				change={{
					TextBounds: (rbx) => {
						textWidthMotion.spring(rbx.TextBounds.X);
					},
				}}
				richText
				font={fonts.inter.medium}
				text={text}
				textColor={palette.base}
				textSize={rem(1.5)}
				size={new UDim2(1, 0, 1, 0)}
				clipsDescendants
			/>
		</PrimaryButton>
	);
}
