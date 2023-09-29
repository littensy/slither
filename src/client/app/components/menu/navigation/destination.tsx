import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Frame } from "client/app/common/frame";
import { Group } from "client/app/common/group";
import { Image } from "client/app/common/image";
import { Outline } from "client/app/common/outline";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useMotion, useRem, useStore } from "client/app/hooks";
import { fonts } from "client/app/utils/fonts";
import { springs } from "client/app/utils/springs";
import { MenuPage, selectIsPage } from "client/store/menu";
import { palette } from "shared/data/palette";

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
	const [transition, transitionMotion] = useMotion(0);

	useEffect(() => {
		transitionMotion.spring(isPage ? 1 : 0, springs.responsive);
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
				key="glow"
				shadowBlur={0.3}
				shadowPosition={rem(0.5)}
				shadowSize={rem(4)}
				shadowColor={color}
				shadowTransparency={lerpBinding(transition, 1, 0.7)}
			/>

			<Frame
				key="background"
				backgroundColor={color}
				backgroundTransparency={lerpBinding(transition, 1, 0.8)}
				cornerRadius={new UDim(0, rem(1))}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Outline
				key="outline"
				outlineTransparency={lerpBinding(transition, 1, 0.5)}
				innerThickness={rem(4, "pixel")}
				outerThickness={rem(2, "pixel")}
				innerColor={color}
				cornerRadius={new UDim(0, rem(1))}
			/>

			<Image
				key="icon"
				image={isPage ? icon : iconAlt}
				imageColor={lerpBinding(transition, palette.text, color)}
				imageTransparency={lerpBinding(transition, 0.7, 0)}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(0, rem(2.25), 0, rem(2.25))}
				position={lerpBinding(transition, new UDim2(0.5, 0, 0.5, 0), new UDim2(0.5, 0, 0.5, rem(-0.75)))}
			/>

			<Group key="label-container" clipsDescendants>
				<Text
					key="label"
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
