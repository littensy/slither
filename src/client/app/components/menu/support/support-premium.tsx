import Roact from "@rbxts/roact";
import { MarketplaceService, Players } from "@rbxts/services";
import { sendAlert } from "client/alert";
import { AwesomeButton } from "client/app/common/awesome-button";
import { Text } from "client/app/common/text";
import { useRem } from "client/app/hooks";
import { palette } from "shared/data/palette";

export function SupportPremium() {
	const rem = useRem();
	const promptPremiumPurchase = async () => {
		if (Players.LocalPlayer.MembershipType === Enum.MembershipType.Premium) {
			sendAlert({
				emoji: "💎",
				message:
					"You get <font color='#fff'>20% more money</font> because of <font color='#fff'>Premium benefits</font>!",
				color: palette.sapphire,
				colorSecondary: palette.blue,
			});
		} else {
			MarketplaceService.PromptPremiumPurchase(Players.LocalPlayer);
		}
	};

	return (
		<AwesomeButton
			onClick={promptPremiumPurchase}
			anchorPoint={new Vector2(1, 1)}
			position={new UDim2(1, rem(-3), 1, rem(-3))}
			size={new UDim2(0, rem(4), 0, rem(4))}
			overlayGradient={new ColorSequence(palette.red, palette.blue)}
		>
			<Text
				key="premium-icon"
				position={new UDim2(0.5, 0, 0.5, 0)}
				textSize={rem(2)}
				textColor={palette.black}
				text="\u{E001} "
			/>
		</AwesomeButton>
	);
}
