import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useMemo, useRef } from "@rbxts/roact";
import { CanvasOrFrame } from "client/common/canvas-or-frame";
import { DelayRender } from "client/common/delay-render";
import { useMotion, useRem } from "client/hooks";
import { MenuPage, selectCurrentPage, selectIsMenuOpen, selectMenuTransition } from "client/store/menu";
import { springs } from "client/utils/springs";

interface MenuContainerProps extends Roact.PropsWithChildren {
	readonly page?: MenuPage;
}

const TRANSITION_DEFAULT = new UDim2(0, 0, 0, -2);
const TRANSITION_LEFT = new UDim2(0, -2, 0, 0);
const TRANSITION_RIGHT = new UDim2(0, 2, 0, 0);

export function MenuContainer({ page, children }: MenuContainerProps) {
	const rem = useRem();

	const isOpen = useSelector(selectIsMenuOpen);
	const currentPage = useSelector(selectCurrentPage);
	const visible = isOpen && (currentPage === page || page === undefined);

	const menuTransition = useSelector(selectMenuTransition);
	const transitionFrom = useRef(rem(TRANSITION_DEFAULT));
	const [transition, transitionMotion] = useMotion(0);

	useEffect(() => {
		transitionMotion.spring(visible ? 1 : 0, springs.gentle);
	}, [visible]);

	// wrapped in useMemo instead of an effect so that it can update
	// the ref synchronously before its used in lerpBinding
	useMemo(() => {
		if (visible) {
			// ease in from menuTransition.direction
			transitionFrom.current = menuTransition.direction === "left" ? rem(TRANSITION_LEFT) : rem(TRANSITION_RIGHT);
		} else {
			// ease out to menuTransition.direction
			transitionFrom.current = menuTransition.direction === "left" ? rem(TRANSITION_RIGHT) : rem(TRANSITION_LEFT);
		}
	}, [currentPage]);

	useMemo(() => {
		if (!isOpen) {
			transitionFrom.current = rem(TRANSITION_DEFAULT);
		}
	}, [isOpen]);

	return (
		<DelayRender shouldRender={visible} unmountDelay={1}>
			<CanvasOrFrame
				key="container"
				groupTransparency={lerpBinding(transition, 1, 0)}
				backgroundTransparency={1}
				size={new UDim2(1, 0, 1, 0)}
				position={lerpBinding(transition, transitionFrom.current, new UDim2())}
				clipsDescendants
			>
				{children}
			</CanvasOrFrame>
		</DelayRender>
	);
}
