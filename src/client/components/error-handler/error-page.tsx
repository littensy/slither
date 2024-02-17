import React, { useEffect } from "@rbxts/react";
import { TeleportService } from "@rbxts/services";
import { Frame } from "client/components/ui/frame";
import { Group } from "client/components/ui/group";
import { Layer } from "client/components/ui/layer";
import { PrimaryButton } from "client/components/ui/primary-button";
import { Text } from "client/components/ui/text";
import { TextField } from "client/components/ui/text-field";
import { fonts } from "client/constants/fonts";
import { useRem } from "client/hooks";
import { playSound, sounds } from "shared/assets";
import { palette } from "shared/constants/palette";

interface ErrorPageProps {
	readonly message: unknown;
}

export function ErrorPage({ message }: ErrorPageProps) {
	const rem = useRem();

	let index = 0;

	useEffect(() => {
		playSound(sounds.alert_bad);
	}, []);

	return (
		<Layer>
			<Frame backgroundColor={palette.crust} size={new UDim2(1, 0, 1, 0)}>
				<uilistlayout
					FillDirection="Vertical"
					VerticalAlignment="Center"
					HorizontalAlignment="Center"
					SortOrder="LayoutOrder"
				/>

				<Text text="🐍" textSize={rem(5)} size={new UDim2(0, rem(5), 0, rem(5))} layoutOrder={index++} />

				<Text
					font={fonts.inter.bold}
					text="Oh Noes!"
					textColor={palette.text}
					textSize={rem(3)}
					textAutoResize="XY"
					layoutOrder={index++}
				/>

				<Group size={new UDim2(0, 0, 0, rem(2))} layoutOrder={index++} />

				<Text
					font={fonts.inter.regular}
					text="Something went wrong, and we were unable to recover."
					textColor={palette.text}
					textSize={rem(1.5)}
					textAutoResize="XY"
					layoutOrder={index++}
				/>

				<Group size={new UDim2(0, 0, 0, rem(0.5))} layoutOrder={index++} />

				<Text
					font={fonts.inter.regular}
					text="Please send this error to the developers, and try reconnecting:"
					textColor={palette.text}
					textSize={rem(1.5)}
					textAutoResize="XY"
					layoutOrder={index++}
				/>

				<Group size={new UDim2(0, 0, 0, rem(2))} layoutOrder={index++} />

				<TextField
					clearTextOnFocus={false}
					textEditable={false}
					font={fonts.robotoMono.regular}
					text={`${message}`}
					textColor={palette.red}
					textSize={rem(1.5)}
					textAutoResize="XY"
					textXAlignment="Left"
					maxVisibleGraphemes={512}
					backgroundColor={palette.base}
					backgroundTransparency={0}
					cornerRadius={new UDim(0, rem(1.5))}
					layoutOrder={index++}
				>
					<uipadding
						PaddingLeft={new UDim(0, rem(2))}
						PaddingRight={new UDim(0, rem(2))}
						PaddingTop={new UDim(0, rem(2))}
						PaddingBottom={new UDim(0, rem(2))}
					/>

					<uistroke Color={palette.red} Transparency={0.3} Thickness={1} ApplyStrokeMode="Border" />
				</TextField>

				<Group size={new UDim2(0, 0, 0, rem(2))} layoutOrder={index++} />

				<PrimaryButton
					onClick={async () => TeleportService.TeleportToPlaceInstance(game.PlaceId, game.JobId)}
					overlayGradient={new ColorSequence(palette.blue, palette.mauve)}
					size={new UDim2(0, rem(12), 0, rem(5))}
					layoutOrder={index++}
				>
					<Text
						font={fonts.inter.medium}
						text="Reconnect →"
						textColor={palette.base}
						textSize={rem(1.5)}
						size={new UDim2(1, 0, 1, 0)}
					/>
				</PrimaryButton>
			</Frame>
		</Layer>
	);
}
