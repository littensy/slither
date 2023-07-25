import { Spring, lerpBinding, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { Image } from "client/app/common/image";
import { ReactiveButton } from "client/app/common/reactive-button";
import { Shadow } from "client/app/common/shadow";
import { Text } from "client/app/common/text";
import { useRem, useStore } from "client/app/hooks";
import { MenuPage, selectIsPage } from "client/store/menu";
import { palette } from "shared/data/palette";
import { MIN_NAV_REM } from "./constants";

interface DestinationProps {
	readonly page: MenuPage;
	readonly label: string;
	readonly icon: string;
	readonly iconAlt: string;
	readonly color: Color3;
	readonly order: number;
}

export function Destination({ page, label, icon, iconAlt, color, order }: DestinationProps) {
	const rem = useRem({ minimum: MIN_NAV_REM });
	const store = useStore();
	const isPage = useSelectorCreator(selectIsPage, page);
	const [transition, setTransition] = useMotor(0);

	useEffect(() => {
		setTransition(new Spring(isPage ? 1 : 0));
	}, [isPage]);

	return (
		<ReactiveButton
			backgroundColor={color}
			backgroundTransparency={lerpBinding(transition, 1, 0.9)}
			cornerRadius={new UDim(0, rem(1))}
			size={new UDim2(0, rem(7), 0, rem(5))}
			layoutOrder={order}
			onClick={() => {
				store.setMenuPage(page);
			}}
		>
			<Shadow
				key="glow"
				shadowBlur={0.3}
				shadowOffset={rem(0.5)}
				shadowSize={rem(4)}
				shadowColor={color}
				shadowTransparency={lerpBinding(transition, 1, 0.7)}
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

			<Text
				key="label"
				font="Rubik"
				fontWeight={Enum.FontWeight.SemiBold}
				text={label.upper()}
				textColor={lerpBinding(transition, palette.text, color)}
				textSize={rem(1.25)}
				textTransparency={lerpBinding(transition, 1, 0.2)}
				position={lerpBinding(transition, new UDim2(0.5, 0, 0.5, rem(0.75)), new UDim2(0.5, 0, 0.5, rem(1)))}
			/>
		</ReactiveButton>
	);
}
