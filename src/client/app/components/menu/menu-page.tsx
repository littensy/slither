import { Spring, lerpBinding, useMotor } from "@rbxts/pretty-react-hooks";
import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { CanvasOrFrame } from "client/app/common/canvas-or-frame";
import { DelayRender } from "client/app/common/delay-render";
import { MenuPage, selectIsMenuOpen, selectIsPage } from "client/store/menu";

interface MenuPageProps extends Roact.PropsWithChildren {
	readonly page: MenuPage;
	readonly transitionFrom?: UDim2;
}

export function MenuPage({ page, transitionFrom = new UDim2(), children }: MenuPageProps) {
	const isPage = useSelectorCreator(selectIsPage, page);
	const isOpen = useSelector(selectIsMenuOpen);
	const visible = isPage && isOpen;
	const [transition, setTransition] = useMotor(0);

	useEffect(() => {
		setTransition(new Spring(visible ? 1 : 0, { frequency: 3 }));
	}, [visible]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<CanvasOrFrame
				groupTransparency={lerpBinding(transition, 1, 0)}
				backgroundTransparency={1}
				size={new UDim2(1, 0, 1, 0)}
				position={lerpBinding(transition, transitionFrom, new UDim2())}
				clipsDescendants
			>
				{children}
			</CanvasOrFrame>
		</DelayRender>
	);
}
