import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { joinBindings, useEffect, useMemo } from "@rbxts/roact";
import { sendAlert } from "client/alert";
import { Frame } from "client/app/common/frame";
import { Image } from "client/app/common/image";
import { Outline } from "client/app/common/outline";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useMotion, useRem } from "client/app/hooks";
import { fonts } from "client/app/utils/fonts";
import { springs } from "client/app/utils/springs";
import { selectMenuCurrentSkin } from "client/store/menu";
import { images } from "shared/assets";
import { LOCAL_USER } from "shared/constants";
import { palette } from "shared/data/palette";
import { findSnakeSkin } from "shared/data/skins";
import { remotes } from "shared/remotes";
import { RANDOM_SKIN, selectCurrentPlayerSkin, selectPlayerBalance, selectPlayerSkins } from "shared/store/saves";

interface Status {
	readonly variant: "buy" | "not-enough-money" | "wear" | "wearing" | "none";
	readonly price?: number;
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
	const equipped = useSelectorCreator(selectCurrentPlayerSkin, LOCAL_USER) ?? RANDOM_SKIN;
	const current = useSelector(selectMenuCurrentSkin);
	const inventory = useSelectorCreator(selectPlayerSkins, LOCAL_USER);
	const balance = useSelectorCreator(selectPlayerBalance, LOCAL_USER);
	const status = getStatus(equipped, current, inventory, balance);

	const [primary, primaryMotion] = useMotion(new Color3());
	const [secondary, secondaryMotion] = useMotion(new Color3());
	const [textWidth, textWidthMotion] = useMotion(0);
	const [spin, spinMotion] = useMotion(0);

	const { size, gradient } = useMemo(() => {
		const size = textWidth.map((width) => {
			return new UDim2(0, width + rem(3), 0, rem(4));
		});

		const gradient = joinBindings([primary, secondary]).map(([primary, secondary]) => {
			return new ColorSequence(primary, secondary);
		});

		return { size, gradient };
	}, []);

	const onClick = () => {
		spinMotion.spring(spin.getValue() + 180, springs.molasses);

		if (status.variant === "buy") {
			remotes.save.buySkin.fire(current);
		} else if (status.variant === "wear") {
			remotes.save.setSkin.fire(current);
		} else if (status.variant === "not-enough-money") {
			sendAlert({
				emoji: "🚨",
				color: palette.red,
				message: `Sorry, you cannot afford the ${current} skin yet.`,
			});
		}
	};

	useEffect(() => {
		switch (status.variant) {
			case "wearing":
				primaryMotion.spring(Color3.fromRGB(51, 255, 182));
				secondaryMotion.spring(Color3.fromRGB(28, 132, 255));
				break;
			case "wear":
				primaryMotion.spring(Color3.fromRGB(255, 115, 84));
				secondaryMotion.spring(Color3.fromRGB(204, 112, 54));
				break;
			case "buy":
				primaryMotion.spring(Color3.fromRGB(51, 255, 171));
				secondaryMotion.spring(Color3.fromRGB(43, 255, 107));
				break;
			case "not-enough-money":
			case "none":
				primaryMotion.spring(palette.mantle);
				secondaryMotion.spring(palette.crust);
				break;
		}
	}, [status.variant]);

	const text =
		status.variant === "buy"
			? `💵  Buy for <font color="#${palette.green.ToHex()}">$${status.price}</font>`
			: status.variant === "wear"
			? "🎨  Wear"
			: status.variant === "wearing"
			? "👕  Wearing"
			: status.variant === "not-enough-money"
			? `🔒  Buy for <font color="#${palette.red.ToHex()}">$${status.price}</font>`
			: "🔒  Locked";

	return (
		<ReactiveButton
			onClick={onClick}
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 1)}
			size={size}
			position={new UDim2(0.5, 0, 1, -rem(19))}
		>
			<Shadow
				key="glow-background"
				shadowColor={palette.white}
				shadowSize={new UDim2()}
				shadowPosition={rem(-1)}
				shadowTransparency={0.8}
			>
				<uigradient key="gradient" Color={gradient} Rotation={spin} />
			</Shadow>

			<Frame
				key="background"
				backgroundColor={palette.base}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Outline
				key="outline"
				innerColor={Color3.fromRGB(156, 218, 233)}
				innerTransparency={0.95}
				cornerRadius={new UDim(0, rem(1))}
			/>

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
				textColor={palette.text}
				textSize={rem(1.5)}
				size={new UDim2(1, 0, 1, 0)}
				clipsDescendants
			/>

			<Image
				key="glow-foreground"
				image={images.ui.button_glow_top}
				imageTransparency={0.6}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			>
				<uigradient key="gradient" Color={gradient} Rotation={spin} />
			</Image>
		</ReactiveButton>
	);
}
