import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo } from "@rbxts/roact";
import { sendAlert } from "client/alert";
import { AwesomeButton } from "client/app/common/awesome-button";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useMotion, useRem } from "client/app/hooks";
import { brighten } from "client/app/utils/color-utils";
import { composeBindings } from "client/app/utils/compose-bindings";
import { fonts } from "client/app/utils/fonts";
import { springs } from "client/app/utils/springs";
import { selectMenuCurrentSkin } from "client/store/menu";
import { sounds } from "shared/assets";
import { LOCAL_USER } from "shared/constants";
import { palette } from "shared/data/palette";
import { findSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { RANDOM_SKIN, selectCurrentPlayerSkin, selectPlayerBalance, selectPlayerSkins } from "shared/store/saves";

interface Status {
	readonly variant: "buy" | "not-enough-money" | "wear" | "wearing" | "none";
	readonly price?: number;
}

const darkGreen = brighten(palette.green, -3);
const darkRed = brighten(palette.red, -3);

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
	const equipped = useSelectorCreator(selectCurrentPlayerSkin, LOCAL_USER) ?? RANDOM_SKIN;
	const current = useSelector(selectMenuCurrentSkin);
	const inventory = useSelectorCreator(selectPlayerSkins, LOCAL_USER);
	const balance = useSelectorCreator(selectPlayerBalance, LOCAL_USER);
	const status = getStatus(equipped, current, inventory, balance);

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
			remotes.save.buySkin.fire(current);
		} else if (status.variant === "wear") {
			remotes.save.setSkin.fire(current);
		} else if (status.variant === "not-enough-money") {
			sendAlert({
				emoji: "🚨",
				color: palette.red,
				message: `Sorry, you cannot afford the <font color="#fff">${current}</font> skin yet.`,
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
			? `💵  Buy for <font color="#${darkGreen.ToHex()}">$${status.price}</font>`
			: status.variant === "wear"
			? "🎨  Wear"
			: status.variant === "wearing"
			? "🎨  Wearing"
			: status.variant === "not-enough-money"
			? `🔒  Costs <font color="#${darkRed.ToHex()}">$${status.price}</font>`
			: "🔒  Locked";

	return (
		<AwesomeButton
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
		</AwesomeButton>
	);
}
