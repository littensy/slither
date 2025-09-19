import { lerpBinding } from "@rbxts/pretty-react-hooks";
import React, { useEffect } from "@rbxts/react";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { Frame } from "client/components/ui/frame";
import { Group } from "client/components/ui/group";
import { Image } from "client/components/ui/image";
import { Outline } from "client/components/ui/outline";
import { ReactiveButton } from "client/components/ui/reactive-button";
import { Shadow } from "client/components/ui/shadow";
import { Text } from "client/components/ui/text";
import { fonts } from "client/constants/fonts";
import { springs } from "client/constants/springs";
import { useRem, useSpring, useStore } from "client/hooks";
import { MenuPage, selectIsPage } from "client/store/menu";
import { palette } from "shared/constants/palette";

interface DestinationProps {
	readonly page: MenuPage;
	readonly label: string;
	readonly icon: string;
	readonly iconAlt: string;
	readonly color: Color3;
	readonly order: number;
}

export function Destination({ page, label, icon, iconAlt, color, order }: DestinationProps) {
	const rem = useRem();
	const store = useStore();
	const isPage = useSelectorCreator(selectIsPage, page);
	const [transition, transitionSpring] = useSpring(0);

	useEffect(() => {
		transitionSpring.setGoal(isPage ? 1 : 0, springs.responsive);
	}, [isPage]);

	return (
		<ReactiveButton
			onClick={() => store.setMenuPage(page)}
			soundVariant="alt"
			backgroundTransparency={1}
			size={new UDim2(0, rem(7), 0, rem(5))}
			layoutOrder={order}
		>
			<Shadow
				shadowBlur={0.3}
				shadowPosition={rem(0.5)}
				shadowSize={rem(4)}
				shadowColor={color}
				shadowTransparency={lerpBinding(transition, 1, 0.7)}
			/>

			<Frame
				backgroundColor={color}
				backgroundTransparency={lerpBinding(transition, 1, 0.8)}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Outline
				outlineTransparency={lerpBinding(transition, 1, 0.5)}
				innerThickness={rem(4, "pixel")}
				outerThickness={rem(2, "pixel")}
				innerColor={color}
				cornerRadius={new UDim(0, rem(1))}
			/>

			<Image
				image={isPage ? icon : iconAlt}
				imageColor={lerpBinding(transition, palette.text, color)}
				imageTransparency={lerpBinding(transition, 0.7, 0)}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(2.25), 0, rem(2.25))}
				position={lerpBinding(transition, new UDim2(0.5, 0, 0.5, 0), new UDim2(0.5, 0, 0.5, rem(-0.75)))}
			/>

			<Group clipsDescendants>
				<Text
					font={fonts.inter.bold}
					text={label}
					textColor={lerpBinding(transition, palette.text, color)}
					textSize={rem(1.2)}
					textTransparency={lerpBinding(transition, 1, 0.2)}
					position={lerpBinding(
						transition,
						new UDim2(0.5, 0, 0.5, rem(4)),
						new UDim2(0.5, 0, 0.5, rem(1.25)),
					)}
				/>
			</Group>
		</ReactiveButton>
	);
}
