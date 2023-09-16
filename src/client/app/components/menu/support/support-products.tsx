import { useViewport } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Group } from "client/app/common/group";
import { useOrientation, useRem } from "client/app/hooks";
import { ProductType } from "shared/assets";
import { palette } from "shared/data/palette";

import { SupportHeart } from "./support-heart";
import { SupportProduct } from "./support-product";

export function SupportProducts() {
	const rem = useRem();
	const padding = rem(1.5);
	const viewport = useViewport();
	const orientation = useOrientation();

	let index = 0;

	return (
		<scrollingframe
			CanvasSize={new UDim2(0, rem(70), 0, 0)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
			ClipsDescendants={false}
			AnchorPoint={new Vector2(0.5, 0.5)}
			Size={new UDim2(0, rem(70), 0, rem(36))}
			Position={new UDim2(0.5, 0, 0.55, 0)}
		>
			<uisizeconstraint key="size-constraint" MaxSize={viewport.map((v) => new Vector2(v.X, math.huge))} />

			{orientation === "portrait" && (
				<uipadding
					key="phone-padding"
					PaddingLeft={new UDim(0, padding)}
					PaddingRight={new UDim(0, padding)}
					PaddingTop={new UDim(0, -2 * padding)}
					PaddingBottom={new UDim(0, 2 * padding)}
				/>
			)}

			<Group key="left-group" size={new UDim2(0.6, -padding / 2, 1, 0)}>
				<SupportProduct
					key="top-left"
					index={index++}
					productId={ProductType.MONEY_100}
					productTitle="$100"
					productSubtitle="🍑  PEACH"
					primaryColor={palette.yellow}
					secondaryColor={palette.peach}
					size={new UDim2(0.5, -padding / 2, 0.5, -padding / 2)}
					position={new UDim2(0, 0, 0, 0)}
				/>
				<SupportProduct
					key="bottom-left"
					index={index++}
					productId={ProductType.MONEY_250}
					productTitle="$250"
					productSubtitle="🍒  MAROON"
					productDiscount="20% OFF"
					primaryColor={palette.maroon}
					secondaryColor={palette.red}
					size={new UDim2(0.5, -padding / 2, 0.5, -padding / 2)}
					position={new UDim2(0, 0, 0.5, padding / 2)}
				/>
				<SupportProduct
					key="top-right"
					index={index++}
					productId={ProductType.MONEY_500}
					productTitle="$500"
					productSubtitle="🍀  GREEN"
					productDiscount="20% OFF"
					primaryColor={palette.teal}
					secondaryColor={palette.green}
					size={new UDim2(0.5, -padding / 2, 0.5, -padding / 2)}
					position={new UDim2(0.5, padding / 2, 0, 0)}
				/>
				<SupportProduct
					key="bottom-right"
					index={index++}
					productId={ProductType.MONEY_1000}
					productTitle="$1,000"
					productSubtitle="🦋  SAPPHIRE"
					productDiscount="20% OFF"
					primaryColor={palette.sapphire}
					secondaryColor={palette.blue}
					size={new UDim2(0.5, -padding / 2, 0.5, -padding / 2)}
					position={new UDim2(0.5, padding / 2, 0.5, padding / 2)}
				/>
			</Group>

			<SupportProduct
				key="right-product"
				index={index++}
				productId={ProductType.MONEY_5000}
				productTitle="$5,000"
				productSubtitle="💜  MAUVE"
				productDiscount="25% OFF"
				primaryColor={palette.mauve}
				secondaryColor={palette.blue}
				size={new UDim2(0.4, -padding / 2, 1, 0)}
				position={new UDim2(0.6, padding / 2, 0, 0)}
			>
				<SupportHeart key="heart" />
			</SupportProduct>
		</scrollingframe>
	);
}
