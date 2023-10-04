import { blend, lerpBinding, useTimeout } from "@rbxts/pretty-react-hooks";
import { composeBindings } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo } from "@rbxts/roact";
import { MarketplaceService, Players } from "@rbxts/services";
import { AwesomeButton } from "client/common/awesome-button";
import { CanvasOrFrame } from "client/common/canvas-or-frame";
import { Frame } from "client/common/frame";
import { Group } from "client/common/group";
import { Outline } from "client/common/outline";
import { ReactiveButton } from "client/common/reactive-button";
import { Shadow } from "client/common/shadow";
import { Text } from "client/common/text";
import { useMotion, useProductPrice, useRem } from "client/hooks";
import { fonts } from "client/utils/fonts";
import { palette } from "shared/constants/palette";
import { brighten } from "shared/utils/color-utils";

interface SupportProductProps extends Roact.PropsWithChildren {
	readonly index: number;
	readonly productId: number;
	readonly productTitle: string;
	readonly productSubtitle: string;
	readonly productDiscount?: string;
	readonly primaryColor: Color3;
	readonly secondaryColor: Color3;
	readonly size: UDim2;
	readonly position: UDim2;
}

export function SupportProduct({
	index,
	productId,
	productTitle,
	productSubtitle,
	productDiscount,
	primaryColor,
	secondaryColor,
	size,
	position,
	children,
}: SupportProductProps) {
	const rem = useRem();
	const price = useProductPrice(productId);

	const initialRotation = useMemo(() => {
		return math.random(15, 30) * (math.random() > 0.5 ? 1 : -1);
	}, []);

	const [hover, hoverMotion] = useMotion(0);
	const [transition, transitionMotion] = useMotion(0);
	const [visible, visibleMotion] = useMotion(0);
	const [glow, glowMotion] = useMotion(0);

	const promptPurchase = async () => {
		MarketplaceService.PromptProductPurchase(Players.LocalPlayer, productId);
	};

	const gradient = new ColorSequence(primaryColor, secondaryColor);

	useTimeout(() => {
		transitionMotion.spring(1, {
			tension: 180,
			friction: 20,
			mass: 2 + 0.3 * index,
			restingVelocity: 0.0001,
		});

		visibleMotion.spring(1, {
			tension: 150,
			friction: 30,
		});
	}, 0.07 * index);

	useTimeout(
		() => {
			glowMotion.spring(1, {
				tension: 50,
				friction: 20,
			});
		},
		1.5 + 0.07 * index,
	);

	return (
		<CanvasOrFrame
			groupTransparency={lerpBinding(visible, 1, 0)}
			rotation={lerpBinding(visible, initialRotation, 0)}
			backgroundTransparency={1}
			size={size}
			position={lerpBinding(transition, position.add(new UDim2(0, 0, 0, rem(6))), position)}
		>
			<ReactiveButton
				key="button"
				onClick={promptPurchase}
				onHover={(hovered) => hoverMotion.spring(hovered ? 1 : 0)}
				backgroundTransparency={1}
				size={new UDim2(1, 0, 1, 0)}
			>
				<Shadow
					key="glow"
					shadowColor={palette.white}
					shadowTransparency={composeBindings(lerpBinding(hover, 0.2, 0), lerpBinding(glow, 1, 0), blend)}
					shadowSize={rem(12)}
				>
					<uigradient key="gradient" Color={gradient} Rotation={95} />
				</Shadow>

				<Shadow
					key="drop-shadow"
					shadowSize={rem(2.5)}
					shadowBlur={0.3}
					shadowTransparency={lerpBinding(hover, 0.7, 0.25)}
					shadowPosition={rem(0.5)}
				/>

				<Frame
					key="background"
					backgroundColor={palette.white}
					cornerRadius={new UDim(0, rem(2))}
					size={new UDim2(1, 0, 1, 0)}
				>
					<uigradient key="gradient" Color={gradient} Rotation={95} />

					<Frame
						key="background-overlay-top"
						backgroundColor={brighten(primaryColor, 2)}
						backgroundTransparency={lerpBinding(hover, 1, 0)}
						cornerRadius={new UDim(0, rem(2))}
						size={new UDim2(1, 0, 1, 0)}
					>
						<uigradient key="gradient" Transparency={new NumberSequence(0, 1)} Rotation={95} />
					</Frame>

					<Frame
						key="background-overlay-bottom"
						backgroundColor={brighten(secondaryColor, 2)}
						backgroundTransparency={lerpBinding(hover, 1, 0)}
						cornerRadius={new UDim(0, rem(2))}
						size={new UDim2(1, 0, 1, 0)}
					>
						<uigradient key="gradient" Transparency={new NumberSequence(1, 0)} Rotation={95} />
					</Frame>

					<Outline key="outline" cornerRadius={new UDim(0, rem(2))} />
				</Frame>

				<Group
					key="header"
					anchorPoint={new Vector2(0.5, 0)}
					size={new UDim2(0, rem(10), 0, rem(7))}
					position={new UDim2(0.5, 0, 0, rem(2))}
				>
					<Text
						key="title"
						font={fonts.inter.bold}
						text={productTitle}
						textSize={rem(4.5)}
						textColor={palette.base}
						size={new UDim2(1, 0, 1, 0)}
					/>

					<Text
						key="subtitle"
						font={fonts.inter.bold}
						text={productSubtitle}
						textSize={rem(1.25)}
						textColor={palette.base}
						textYAlignment="Bottom"
						size={new UDim2(1, 0, 1, 0)}
					/>

					{productDiscount !== undefined && (
						<Text
							key="discount"
							richText
							font={fonts.inter.bold}
							text={productDiscount}
							textSize={rem(1.25)}
							textColor={palette.base}
							textYAlignment="Top"
							size={new UDim2(1, 0, 1, 0)}
						/>
					)}
				</Group>

				<AwesomeButton
					key="purchase-button"
					onClick={promptPurchase}
					overlayGradient={gradient}
					anchorPoint={new Vector2(0.5, 1)}
					size={new UDim2(1, rem(-4), 0, rem(4.25))}
					position={new UDim2(0.5, 0, 1, rem(-2.25))}
				>
					<Text
						key="price"
						font={fonts.inter.medium}
						text={`\u{E002}${price}`}
						textSize={rem(1.5)}
						textColor={palette.base}
						position={new UDim2(0.5, 0, 0.5, 0)}
					/>
				</AwesomeButton>

				{children}
			</ReactiveButton>
		</CanvasOrFrame>
	);
}
