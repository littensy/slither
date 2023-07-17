import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { useRem, useStore } from "client/app/hooks";
import { selectHasLocalSnake } from "shared/store/snakes";
import { Home } from "./home";
import { MenuPage } from "./menu-page";
import { MenuVignette } from "./menu-vignette";

export function Menu() {
	const store = useStore();
	const rem = useRem();
	const spawned = useSelector(selectHasLocalSnake);

	useEffect(() => {
		store.setMenuOpen(!spawned);
	}, [spawned]);

	return (
		<>
			<MenuVignette />
			<MenuPage page="home" transitionFrom={new UDim2(0, 0, 0, rem(2))}>
				<Home />
			</MenuPage>
		</>
	);
}
